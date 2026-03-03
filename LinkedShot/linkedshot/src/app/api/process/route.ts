import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase";

const FAL_ENDPOINTS = {
  amazon: "https://fal.run/fal-ai/bria/background/remove",
  transparent: "https://fal.run/fal-ai/imageutils/rembg",
  lifestyle: "https://fal.run/fal-ai/bria/product-shot",
  upscale: "https://fal.run/fal-ai/topaz/upscale/image",
} as const;

export type ProcessMode = keyof typeof FAL_ENDPOINTS;

const CREDITS_PER_MODE: Record<ProcessMode, number> = {
  amazon: 1,
  transparent: 1,
  lifestyle: 2,
  upscale: 1,
};

interface ProcessOptions {
  scene?: string;
  placement?: string;
  refImageUrl?: string;
  upscaleFactor?: number;
}

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
    const { imageUrl, mode: rawMode, options: rawOptions } = body as {
      imageUrl?: string;
      mode?: string;
      options?: ProcessOptions;
    };
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "imageUrl required" },
        { status: 400 }
      );
    }
    const validModes: ProcessMode[] = ["amazon", "transparent", "lifestyle", "upscale"];
    const mode: ProcessMode = validModes.includes(rawMode as ProcessMode)
      ? (rawMode as ProcessMode)
      : "amazon";
    const falUrl = FAL_ENDPOINTS[mode];
    const creditsNeeded = CREDITS_PER_MODE[mode];

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
    if (creditsRow.amount < creditsNeeded) {
      return NextResponse.json(
        { error: `Not enough credits. You need ${creditsNeeded} credit(s) for this mode.` },
        { status: 403 }
      );
    }

    const startMs = Date.now();

    // Build FAL request body based on mode
    function buildFalBody(): Record<string, unknown> {
      switch (mode) {
        case "lifestyle":
          return {
            image_url: imageUrl,
            scene_description: rawOptions?.scene || "on a clean white marble table with soft natural lighting",
            ...(rawOptions?.refImageUrl ? { ref_image_url: rawOptions.refImageUrl } : {}),
            placement_type: "manual_placement",
            manual_placement_selection: rawOptions?.placement || "bottom_center",
            num_results: 1,
            fast: true,
          };
        case "upscale":
          return {
            image_url: imageUrl,
            model: "Standard V2",
            upscale_factor: rawOptions?.upscaleFactor || 2,
            output_format: "png",
            face_enhancement: false,
            subject_detection: "All",
          };
        default:
          return { image_url: imageUrl };
      }
    }

    const falBody = buildFalBody();
    const timeoutMs = mode === "lifestyle" ? 90_000 : 60_000; // lifestyle can be slower

    const callFalWithTimeout = (): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      return fetch(falUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Key ${process.env.FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(falBody),
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
      images?: { url?: string }[];
      url?: string;
      request_id?: string;
    };

    // Extract result URL based on mode (different response shapes)
    let resultImageUrl: string | null = null;
    if (mode === "lifestyle") {
      resultImageUrl = falData.images?.[0]?.url ?? null;
    } else if (mode === "upscale") {
      resultImageUrl = falData.image?.url ?? null;
    } else {
      resultImageUrl = falData.image?.url ?? falData.url ?? null;
    }
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
        amount: Math.max(0, creditsRow.amount - creditsNeeded),
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
