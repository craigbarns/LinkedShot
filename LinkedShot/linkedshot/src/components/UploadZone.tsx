"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function SignInWithGoogleButton() {
  const handleClick = () => {
    try {
      const supabase = createClient();
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`;
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-zinc-50"
    >
      <GoogleIcon />
      <span className="font-medium">Continue with Google</span>
    </button>
  );
}

export default function UploadZone() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: u },
        } = await supabase.auth.getUser();
        setUser(u ?? null);

        if (u) {
          const { data } = await supabase
            .from("credits")
            .select("amount")
            .eq("user_id", u.id)
            .single();
          setCredits(data?.amount ?? 0);
        }
      } catch (err) {
        setConfigError(
          err instanceof Error ? err.message : "Configure .env.local"
        );
      }
    };
    checkUser();
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) {
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      if (credits <= 0) {
        return;
      }

      setProcessing(true);
      setResult(null);
      setOriginal(null);

      try {
        const supabase = createClient();
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("raw")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("raw")
          .getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;
        setOriginal(publicUrl);

        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        const response = await fetch("/api/process", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ imageUrl: publicUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Processing error");
        }

        const resultUrl = data.resultUrl ?? data.processedUrl;
        if (resultUrl) {
          setResult(resultUrl);
          setCredits((c) => Math.max(0, c - 1));
        } else {
          throw new Error(data.error || "No result");
        }
      } catch (error) {
        console.error(error);
        setResult(null);
        setOriginal(null);
      } finally {
        setProcessing(false);
      }
    },
    [user, credits]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: !user || credits <= 0 || processing,
  });

  if (configError) {
    return (
      <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center text-sm text-amber-800">
        <p>{configError}</p>
        <p className="mt-2">
          Copy <code className="rounded bg-amber-100 px-1">.env.local.example</code> to{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code>.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-gray-50 p-8 text-center">
        <p className="mb-4 text-zinc-600">
          Sign in to process your images
        </p>
        <SignInWithGoogleButton />
        <p className="mt-3 text-sm text-zinc-500">
            or{" "}
            <Link href="/login" className="underline hover:text-zinc-700">
              other sign-in options
            </Link>
        </p>
      </div>
    );
  }

  if (credits === 0 && !result) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-4xl">🎉</div>
        <h3 className="mb-2 text-xl font-bold text-zinc-900">
          You used your 3 free credits!
        </h3>
        <p className="mb-6 text-gray-600">
          Ready to process your entire catalog?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/#pricing"
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Upgrade to Starter (9€ or $9)
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          50 images • ~€0.18 per image
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700">
          Credits remaining: {credits}
        </span>
        <button
          type="button"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.reload();
          }}
          className="text-sm text-zinc-500 underline hover:text-zinc-700"
        >
          Sign out
        </button>
      </div>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-zinc-300 bg-gray-50 hover:border-zinc-400"
        } ${processing ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        {processing ? (
          <p className="font-medium text-blue-600">
            LinkedShot AI processing…
          </p>
        ) : (
          <div>
            <p className="mb-2 font-medium text-zinc-700">
              Drag an image here or click
            </p>
            <p className="text-sm text-zinc-500">
              JPG, PNG, WebP (max 5 MB)
            </p>
          </div>
        )}
      </div>

      {original && result && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-zinc-600">
              Original
            </p>
            <img
              src={original}
              alt="Original"
              className="w-full rounded-lg border border-zinc-200"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-green-700">
              LinkedShot (white background)
            </p>
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <img
                src={result}
                alt="Processed"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <a
              href={result}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block w-full rounded-lg bg-zinc-900 px-6 py-2 text-center text-sm font-medium text-white hover:bg-zinc-800"
            >
              Download HD
            </a>
          </div>
        </div>
      )}

      {credits === 0 && (original || result) && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center">
          <p className="mb-3 font-medium text-zinc-800">
            You used your 3 free credits!
          </p>
          <p className="mb-4 text-sm text-zinc-600">
            Ready to process more? Upgrade to Starter for 50 images.
          </p>
          <Link
            href="/#pricing"
            className="inline-block rounded-lg bg-black px-6 py-2.5 font-semibold text-white hover:bg-zinc-800"
          >
            Upgrade to Starter (9€ or $9)
          </Link>
        </div>
      )}
    </div>
  );
}
