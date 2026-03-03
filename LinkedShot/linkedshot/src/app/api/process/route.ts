import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase";

const FAL_ENDPOINTS = {
  amazon: "https://fal.run/fal-ai/bria/background/remove",
  transparent: "https://fal.run/fal-ai/imageutils/rembg",
} as const;

export type ProcessMode = keyof typeof FAL_ENDPOINTS;

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  try {
    let user: { id: string } | null = null;

    // 1. Try cookie-based auth
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
    const { data: { user: cookieUser } } = await supabaseAuth.auth.getUser();
    if (cookieUser) user = cookieUser;

    // 2. Fallback: Bearer token (needed in production / Vercel where cookies may not pass)
    if (!user) {
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
      if (token) {
        const supabaseWithToken = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        );
        const { data: { user: tokenUser } } = await supabaseWithToken.auth.getUser();
        if (tokenUser) user = tokenUser;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { imageUrl, mode: rawMode } = body as { imageUrl?: string; mode?: string };
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "imageUrl required" },
        { status: 400 }
      );
    }
    const mode: ProcessMode =
      rawMode === "transparent" ? "transparent" : "amazon";
    const falUrl = FAL_ENDPOINTS[mode];

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

    const startMs = Date.now();

    const callFalWithTimeout = (): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60_000);
      return fetch(falUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Key ${process.env.FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      }).finally(() => clearTimeout(timeoutId));
    };

    let falRes = await callFalWithTimeout();
    if (!falRes.ok && falRes.status >= 500 && falRes.status < 600) {
      falRes = await callFalWithTimeout();
    }

    const durationMs = Date.now() - startMs;

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error(JSON.stringify({
        event: "job_failed",
        status: falRes.status,
        duration_ms: durationMs,
        error_msg: errText.slice(0, 500),
        mode,
      }));
      return NextResponse.json(
        { error: "Our AI is busy or couldn't process this image. Please try again in a few seconds." },
        { status: 502 }
      );
    }

    const falData = (await falRes.json()) as {
      image?: { url?: string };
      url?: string;
      request_id?: string;
    };
    const resultImageUrl =
      falData.image?.url ?? falData.url ?? null;
    if (!resultImageUrl) {
      console.error(JSON.stringify({
        event: "job_failed",
        duration_ms: durationMs,
        fal_request_id: falData.request_id ?? null,
        error_msg: "No result URL in FAL response",
        mode,
      }));
      return NextResponse.json(
        { error: "We couldn't get a result for this image. Try another photo or try again." },
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

    console.info(JSON.stringify({
      event: "job_succeeded",
      duration_ms: durationMs,
      fal_request_id: (falData as { request_id?: string }).request_id ?? null,
      mode,
      status: "done",
    }));

    const rawPath = imageUrl.split("/storage/v1/object/public/raw/")[1] ?? null;
    const usedFreeCredit = creditsRow.amount <= 3;
    const jobPayload = {
      user_id: user.id,
      original_path: rawPath ?? imageUrl,
      processed_path: processedPath,
      status: "done",
      used_free_credit: usedFreeCredit,
    };
    let { error: jobInsertError } = await admin.from("jobs").insert(jobPayload);

    // Fallback: if insert fails (e.g. used_free_credit column missing), retry without it
    if (jobInsertError) {
      console.error("Job insert error (retrying without used_free_credit):", jobInsertError);
      const { user_id, original_path, processed_path, status } = jobPayload;
      const { error: retryError } = await admin.from("jobs").insert({
        user_id,
        original_path,
        processed_path,
        status,
      });
      if (retryError) {
        console.error("Job insert retry also failed:", retryError);
        jobInsertError = retryError;
      } else {
        jobInsertError = null;
      }
    }

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
      ...(jobInsertError && { warning: "Image processed but failed to save to history. Please contact support." }),
    });
  } catch (e) {
    console.error("Process error:", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
