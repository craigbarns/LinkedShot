import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase";

const FAL_URL = "https://fal.run/fal-ai/bria/background/remove";

/**
 * POST /api/upload-and-process
 * Reçoit le fichier image en FormData (champ "image"), upload côté serveur, puis process.
 * Évite tout upload direct du navigateur vers Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image");
    if (!file || !(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "Send an image (form field: image)" }, { status: 400 });
    }

    const admin = createServiceRoleClient();

    const { data: creditsRow, error: creditsError } = await admin
      .from("credits")
      .select("amount")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !creditsRow) {
      return NextResponse.json({ error: "Credits not found" }, { status: 403 });
    }
    if (creditsRow.amount <= 0) {
      return NextResponse.json({ error: "No credits available" }, { status: 403 });
    }

    const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".jpg";
    const rawPath = `${user.id}/${Date.now()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: rawUploadError } = await admin.storage
      .from("raw")
      .upload(rawPath, buffer, { contentType: file.type || "image/jpeg", upsert: false });

    if (rawUploadError) {
      console.error("Upload raw error:", rawUploadError);
      return NextResponse.json(
        { error: "Upload failed. Check that the 'raw' bucket exists in Supabase Storage." },
        { status: 500 }
      );
    }

    const { data: rawUrlData } = admin.storage.from("raw").getPublicUrl(rawPath);
    const imageUrl = rawUrlData.publicUrl;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000);
    let falRes = await fetch(FAL_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: imageUrl }),
    }).finally(() => clearTimeout(timeoutId));

    if (!falRes.ok && falRes.status >= 500 && falRes.status < 600) {
      falRes = await fetch(FAL_URL, {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });
    }

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error("FAL error:", falRes.status, errText);
      return NextResponse.json(
        { error: "AI processing failed. Try again in a few seconds." },
        { status: 502 }
      );
    }

    const falData = (await falRes.json()) as { image?: { url?: string }; url?: string };
    const resultImageUrl = falData.image?.url ?? falData.url ?? null;
    if (!resultImageUrl) {
      return NextResponse.json(
        { error: "No result from AI. Try another image." },
        { status: 502 }
      );
    }

    const imageResponse = await fetch(resultImageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Failed to save result" }, { status: 502 });
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const processedPath = `${user.id}/${Date.now()}-processed.png`;

    const { error: processedUploadError } = await admin.storage
      .from("processed")
      .upload(processedPath, imageBuffer, { contentType: "image/png", upsert: false });

    if (processedUploadError) {
      console.error("Upload processed error:", processedUploadError);
      return NextResponse.json(
        { error: "Failed to save result. Check that the 'processed' bucket exists." },
        { status: 500 }
      );
    }

    const usedFreeCredit = creditsRow.amount <= 3;
    const { error: jobInsertError } = await admin.from("jobs").insert({
      user_id: user.id,
      original_path: rawPath,
      processed_path: processedPath,
      status: "done",
      used_free_credit: usedFreeCredit,
    });
    if (jobInsertError) {
      console.error("Job insert error:", jobInsertError);
    }

    const { data: processedUrlData } = admin.storage.from("processed").getPublicUrl(processedPath);

    await admin
      .from("credits")
      .update({
        amount: Math.max(0, creditsRow.amount - 1),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    return NextResponse.json({
      resultUrl: processedUrlData.publicUrl,
      processedUrl: processedUrlData.publicUrl,
      status: "done",
    });
  } catch (e) {
    console.error("Upload-and-process error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
