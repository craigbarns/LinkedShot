import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

const FAL_URL = "https://fal.run/fal-ai/bria/background/remove";
const COOKIE_NAME = "ls_anon_sid";

function getSessionId(request: NextRequest): string | null {
  const cookie = request.cookies.get(COOKIE_NAME);
  return cookie?.value ?? null;
}

function generateSessionId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
}

function getIpPrefix(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? null;
  if (!ip) return null;
  const parts = ip.split(".");
  if (parts.length === 4) return parts.slice(0, 3).join(".");
  return ip;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  try {
    let sessionId = getSessionId(request);
    if (!sessionId) {
      sessionId = generateSessionId();
      response.cookies.set(COOKIE_NAME, sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    const admin = createServiceRoleClient();
    const ipPrefix = getIpPrefix(request);

    const { data: row } = await admin
      .from("anonymous_trials")
      .select("session_id, trials_used")
      .eq("session_id", sessionId)
      .single();

    if (row && row.trials_used >= 1) {
      return NextResponse.json(
        { error: "You've already used your 1 free image. Create an account to get 2 more free." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Send an image (form field: image)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".jpg";
    const rawPath = `anon/${sessionId}/${Date.now()}${ext}`;
    const { error: uploadError } = await admin.storage
      .from("raw")
      .upload(rawPath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Anonymous raw upload:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = admin.storage.from("raw").getPublicUrl(rawPath);
    const imageUrl = urlData.publicUrl;

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
      console.error("FAL anonymous error:", falRes.status, errText);
      return NextResponse.json(
        { error: "Our AI is busy. Please try again in a few seconds." },
        { status: 502 }
      );
    }

    const falData = (await falRes.json()) as { image?: { url?: string }; url?: string };
    const resultImageUrl = falData.image?.url ?? falData.url ?? null;
    if (!resultImageUrl) {
      return NextResponse.json(
        { error: "We couldn't process this image. Try another." },
        { status: 502 }
      );
    }

    const imageResponse = await fetch(resultImageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Failed to download result" }, { status: 502 });
    }
    const resultBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const processedPath = `anon/${sessionId}/${Date.now()}-processed.png`;
    const { error: processedUploadError } = await admin.storage
      .from("processed")
      .upload(processedPath, resultBuffer, { contentType: "image/png", upsert: false });

    if (processedUploadError) {
      console.error("Anonymous processed upload:", processedUploadError);
      return NextResponse.json({ error: "Save failed" }, { status: 500 });
    }

    const { data: processedUrlData } = admin.storage.from("processed").getPublicUrl(processedPath);

    await admin.from("anonymous_trials").upsert(
      {
        session_id: sessionId,
        trials_used: 1,
        ip_prefix: ipPrefix,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" }
    );

    const res = NextResponse.json({
      resultUrl: processedUrlData.publicUrl,
      processedUrl: processedUrlData.publicUrl,
      status: "done",
    });
    if (getSessionId(request) !== sessionId) {
      res.cookies.set(COOKIE_NAME, sessionId!, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return res;
  } catch (e) {
    console.error("Process anonymous error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
