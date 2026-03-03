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
      const redirectTo = `${window.location.origin}/auth/callback`;
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

type ProcessMode = "amazon" | "transparent";

const MAX_BULK = 10;

export default function UploadZone() {
  const [mode, setMode] = useState<ProcessMode>("amazon");
  const [processing, setProcessing] = useState(false);
  const [processingSeconds, setProcessingSeconds] = useState(0);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [configError, setConfigError] = useState<string | null>(null);
  const [queue, setQueue] = useState<File[] | null>(null);
  const [bulkResults, setBulkResults] = useState<{ original: string; resultUrl: string }[]>([]);
  const [bulkIndex, setBulkIndex] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);

  useEffect(() => {
    if (!processing) {
      setProcessingSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setProcessingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [processing]);

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

  const processOneFile = useCallback(
    async (file: File): Promise<{ original: string; resultUrl: string }> => {
      const supabase = createClient();
      const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".jpg";
      const filePath = `${user!.id}/${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("raw")
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("raw").getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const response = await fetch("/api/process", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ imageUrl: publicUrl, mode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Processing error");
      const resultUrl = data.resultUrl ?? data.processedUrl;
      if (!resultUrl) throw new Error(data.error || "No result");
      return { original: publicUrl, resultUrl };
    },
    [user, mode]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user || credits <= 0) return;
      const files = acceptedFiles.slice(0, MAX_BULK);
      if (files.length === 0) return;

      if (files.length === 1) {
        setProcessing(true);
        setResult(null);
        setOriginal(null);
        setQueue(null);
        setBulkResults([]);
        try {
          const { original: o, resultUrl: r } = await processOneFile(files[0]);
          setOriginal(o);
          setResult(r);
          setCredits((c) => Math.max(0, c - 1));
        } catch (error) {
          console.error(error);
          const msg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
          alert(msg);
        } finally {
          setProcessing(false);
        }
        return;
      }

      setQueue(files);
      setBulkResults([]);
      setBulkIndex(0);
    },
    [user, credits, processOneFile]
  );

  const startBulkProcess = useCallback(async () => {
    if (!queue || queue.length === 0 || !user) return;
    if (credits < queue.length) {
      alert(`Not enough credits: you have ${credits}, need ${queue.length}. Upgrade or select fewer images.`);
      return;
    }
    setProcessing(true);
    const files = [...queue];
    setBulkTotal(files.length);
    setQueue(null);
    const results: { original: string; resultUrl: string }[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setBulkIndex(i + 1);
        const one = await processOneFile(files[i]);
        results.push(one);
        setBulkResults([...results]);
        setCredits((c) => Math.max(0, c - 1));
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Bulk processing stopped.");
    } finally {
      setProcessing(false);
      setBulkIndex(0);
    }
  }, [queue, user, credits, processOneFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: MAX_BULK,
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
        <p className="mb-1 text-lg font-semibold text-zinc-800">
          Get your 3 free images — no credit card
        </p>
        <p className="mb-6 text-sm text-zinc-600">
          Sign in once, then upload and download. Takes about 10 seconds.
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

  const handleUpgradeStarter = async () => {
    setUpgradeLoading(true);
    try {
      const localeRes = await fetch("/api/locale", { credentials: "include" });
      const localeData = localeRes.ok ? await localeRes.json() : { currency: "eur" };
      const currency = localeData.currency === "usd" ? "usd" : "eur";
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "starter", currency }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname + "#upload");
          return;
        }
        alert(data.error || "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment link could not be created. Please try again or contact support.");
      }
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setUpgradeLoading(false);
    }
  };

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
          <button
            type="button"
            onClick={handleUpgradeStarter}
            disabled={upgradeLoading}
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-70"
          >
            {upgradeLoading ? "Redirecting…" : "Upgrade to Starter (9€ or $9)"}
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          50 images • ~€0.18 per image
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
          <button
            type="button"
            onClick={() => setMode("amazon")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "amazon"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Amazon (white background)
          </button>
          <button
            type="button"
            onClick={() => setMode("transparent")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "transparent"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Transparent
          </button>
        </div>
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
          <div className="font-medium text-blue-600">
            <p>{bulkTotal > 0 ? `Processing image ${bulkIndex} of ${bulkTotal}…` : "AI processing your image…"}</p>
            <p className="mt-1 text-sm font-normal text-zinc-500">
              ~3 seconds • {processingSeconds}s
            </p>
            {processingSeconds >= 8 && (
              <p className="mt-2 text-sm text-amber-600">
                This one is taking longer — we&apos;re still working on it.
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-2 font-medium text-zinc-700">
              Drag image(s) here or click
            </p>
            <p className="text-sm text-zinc-500">
              JPG, PNG, WebP (max 5 MB) · up to {MAX_BULK} at once for bulk
            </p>
          </div>
        )}
      </div>

      {queue && queue.length > 0 && !processing && (
        <div className="mt-6 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6">
          <p className="mb-2 font-semibold text-zinc-800">
            {queue.length} image{queue.length > 1 ? "s" : ""} selected (1 credit each)
          </p>
          <p className="mb-4 text-sm text-zinc-600">
            {credits < queue.length
              ? `Not enough credits: you have ${credits}, need ${queue.length}. Upgrade or drop fewer images.`
              : "Process all now?"}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startBulkProcess}
              disabled={credits < queue.length}
              className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              Process all ({queue.length})
            </button>
            <button
              type="button"
              onClick={() => setQueue(null)}
              className="rounded-lg border-2 border-zinc-300 bg-white px-6 py-2.5 font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {bulkResults.length > 0 && !processing && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-800">
              Bulk results ({bulkResults.length} image{bulkResults.length > 1 ? "s" : ""})
            </h3>
            <button
              type="button"
              onClick={() => {
                setBulkResults([]);
                setOriginal(null);
                setResult(null);
              }}
              className="rounded-lg border-2 border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Process more
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bulkResults.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <div className={`mb-2 flex aspect-square items-center justify-center overflow-hidden rounded border border-zinc-100 ${mode === "amazon" ? "bg-white" : "bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#f5f5f5_0%_50%)_50%_/16px_16px]"}`}>
                  <img src={item.resultUrl} alt={`Result ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex gap-2">
                  <a href={item.resultUrl} download target="_blank" rel="noopener noreferrer" className="flex-1 rounded bg-zinc-900 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-zinc-800">
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(item.resultUrl);
                      alert("Link copied!");
                    }}
                    className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Copy link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              {mode === "amazon"
                ? "LinkedShot (white background)"
                : "LinkedShot (transparent PNG)"}
            </p>
            <div className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-200 ${mode === "amazon" ? "bg-white" : "bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#f5f5f5_0%_50%)_50%_/16px_16px]"}`}>
              <img
                src={result}
                alt="Processed"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={result}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-zinc-900 px-6 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800"
              >
                Download HD
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert("Link copied to clipboard!");
                }}
                className="rounded-lg border-2 border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Copy link
              </button>
              <button
                type="button"
                onClick={() => {
                  setOriginal(null);
                  setResult(null);
                  setBulkResults([]);
                  setQueue(null);
                }}
                className="rounded-lg border-2 border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Process another image
              </button>
            </div>
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
          <button
            type="button"
            onClick={handleUpgradeStarter}
            disabled={upgradeLoading}
            className="inline-block rounded-lg bg-black px-6 py-2.5 font-semibold text-white hover:bg-zinc-800 disabled:opacity-70"
          >
            {upgradeLoading ? "Redirecting…" : "Upgrade to Starter (9€ or $9)"}
          </button>
        </div>
      )}
    </div>
  );
}
