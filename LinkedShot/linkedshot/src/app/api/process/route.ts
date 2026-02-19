import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase";

const FAL_URL = "https://fal.run/fal-ai/bria/background/remove";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  try {
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { imageUrl } = body as { imageUrl?: string };
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "imageUrl required" },
        { status: 400 }
      );
    }

    const admin = createServiceRoleClient();

    const { data: creditsRow, error: creditsError } = await admin
      .from("credits")
      .select("amount")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !creditsRow) {
      return NextResponse.json(
        { error: "Credits not found" },
        { status: 403 }
      );
    }
    if (creditsRow.amount <= 0) {
      return NextResponse.json(
        { error: "No credits available" },
        { status: 403 }
      );
    }

    const falRes = await fetch(FAL_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error("FAL error:", falRes.status, errText);
      return NextResponse.json(
        { error: "FAL processing error" },
        { status: 502 }
      );
    }

    const falData = (await falRes.json()) as {
      image?: { url?: string };
      url?: string;
    };
    const resultImageUrl =
      falData.image?.url ?? falData.url ?? null;
    if (!resultImageUrl) {
      return NextResponse.json(
        { error: "Invalid FAL response" },
        { status: 502 }
      );
    }

    const imageResponse = await fetch(resultImageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to download processed image" },
        { status: 502 }
      );
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const processedPath = `${user.id}/${Date.now()}-processed.png`;

    const { error: uploadError } = await admin.storage
      .from("processed")
      .upload(processedPath, imageBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload processed error:", uploadError);
      return NextResponse.json(
        { error: "Processed image upload error" },
        { status: 500 }
      );
    }

    const rawPath = imageUrl.split("/storage/v1/object/public/raw/")[1] ?? null;
    const usedFreeCredit = creditsRow.amount <= 3;
    await admin.from("jobs").insert({
      user_id: user.id,
      original_path: rawPath ?? imageUrl,
      processed_path: processedPath,
      status: "done",
      used_free_credit: usedFreeCredit,
    });

    const {
      data: { publicUrl },
    } = admin.storage.from("processed").getPublicUrl(processedPath);

    const { error: decrementError } = await admin
      .from("credits")
      .update({
        amount: Math.max(0, creditsRow.amount - 1),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (decrementError) {
      console.error("Decrement credits error:", decrementError);
    }

    return NextResponse.json({
      processedUrl: publicUrl,
      resultUrl: publicUrl,
      status: "done",
    });
  } catch (e) {
    console.error("Process error:", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
