"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { track } from "@/lib/analytics";
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

type ProcessMode = "amazon" | "transparent" | "lifestyle" | "upscale";

const SCENE_PRESETS = [
  { label: "Marble table", value: "on a clean white marble table with soft natural lighting" },
  { label: "Wooden desk", value: "on a warm wooden desk in a cozy home office" },
  { label: "Kitchen counter", value: "on a modern kitchen counter with plants in the background" },
  { label: "Outdoor garden", value: "in a beautiful outdoor garden with soft morning sunlight" },
  { label: "Studio gradient", value: "on a clean surface with a soft gradient studio background" },
  { label: "Luxury shelf", value: "on a luxury glass shelf in a high-end boutique" },
] as { label: string; value: string }[];

const CREDITS_PER_MODE: Record<ProcessMode, number> = {
  amazon: 1,
  transparent: 1,
  lifestyle: 2,
  upscale: 1,
};

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
  const [bulkResults, setBulkResults] = useState<
    { original: string; resultUrl?: string; error?: string }[]
  >([]);
  const [bulkIndex, setBulkIndex] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);
  const [zipLoading, setZipLoading] = useState(false);
  const [anonymousResult, setAnonymousResult] = useState<string | null>(null);
  const [anonymousProcessing, setAnonymousProcessing] = useState(false);
  const [anonymousError, setAnonymousError] = useState<string | null>(null);
  const [sceneDescription, setSceneDescription] = useState(SCENE_PRESETS[0].value);
  const [customScene, setCustomScene] = useState("");
  const [upscaleFactor, setUpscaleFactor] = useState<number>(2);

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

  const processFromUrl = useCallback(
    async (imageUrl: string): Promise<string> => {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      // Build mode-specific options
      const options: Record<string, unknown> = {};
      if (mode === "lifestyle") {
        options.scene = customScene.trim() || sceneDescription;
      } else if (mode === "upscale") {
        options.upscaleFactor = upscaleFactor;
      }

      const response = await fetch("/api/process", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ imageUrl, mode, options }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Processing error");
      const resultUrl = data.resultUrl ?? data.processedUrl;
      if (!resultUrl) throw new Error(data.error || "No result");
      return resultUrl;
    },
    [mode, sceneDescription, customScene, upscaleFactor]
  );

  const uploadAndGetUrl = useCallback(
    async (file: File): Promise<string> => {
      const supabase = createClient();
      const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".jpg";
      const filePath = `${user!.id}/${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
      const { error: uploadError } = await supabase.storage.from("raw").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("raw").getPublicUrl(filePath);
      return urlData.publicUrl;
    },
    [user]
  );

  const processOneFile = useCallback(
    async (file: File): Promise<{ original: string; resultUrl: string }> => {
      const publicUrl = await uploadAndGetUrl(file);
      const resultUrl = await processFromUrl(publicUrl);
      return { original: publicUrl, resultUrl };
    },
    [uploadAndGetUrl, processFromUrl]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user || credits <= 0) return;
      const files = acceptedFiles.slice(0, MAX_BULK);
      if (files.length === 0) return;

      track("upload_started", { count: files.length });
      track("job_created", { mode, nb_images: files.length });

      if (files.length === 1) {
        setProcessing(true);
        setResult(null);
        setOriginal(null);
        setQueue(null);
        setBulkResults([]);
        const start = Date.now();
        try {
          const { original: o, resultUrl: r } = await processOneFile(files[0]);
          setOriginal(o);
          setResult(r);
          setCredits((c) => Math.max(0, c - 1));
          track("job_succeeded", { mode, duration_ms: Date.now() - start });
        } catch (error) {
          console.error(error);
          track("job_failed", { mode, duration_ms: Date.now() - start });
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
    [user, credits, processOneFile, mode]
  );

  const startBulkProcess = useCallback(async () => {
    if (!queue || queue.length === 0 || !user || processing) return;
    if (credits < queue.length) {
      alert(`Not enough credits: you have ${credits}, need ${queue.length}. Upgrade or select fewer images.`);
      return;
    }
    track("bulk_process_all_clicked", { N: queue.length });
    setProcessing(true);
    const files = [...queue];
    setBulkTotal(files.length);
    setQueue(null);
    const results: { original: string; resultUrl?: string; error?: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      setBulkIndex(i + 1);
      let publicUrl: string;
      try {
        publicUrl = await uploadAndGetUrl(files[i]);
      } catch (e) {
        results.push({ original: "", error: "Upload failed" });
        setBulkResults([...results]);
        continue;
      }
      const start = Date.now();
      try {
        const resultUrl = await processFromUrl(publicUrl);
        results.push({ original: publicUrl, resultUrl });
        setCredits((c) => Math.max(0, c - 1));
        track("job_succeeded", { mode, duration_ms: Date.now() - start });
      } catch (error) {
        track("job_failed", { mode, duration_ms: Date.now() - start });
        results.push({
          original: publicUrl,
          error: error instanceof Error ? error.message : "Processing failed",
        });
      }
      setBulkResults([...results]);
    }
    setProcessing(false);
    setBulkIndex(0);
  }, [queue, user, credits, processing, uploadAndGetUrl, processFromUrl]);

  const downloadZip = useCallback(async () => {
    const successUrls = bulkResults
      .map((r) => r.resultUrl)
      .filter((u): u is string => !!u);
    if (successUrls.length < 2) return;
    setZipLoading(true);
    try {
      const res = await fetch("/api/download-zip", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: successUrls }),
      });
      if (!res.ok) throw new Error("ZIP failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "linkedshot-images.zip";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
      alert("Could not create ZIP. Try downloading images one by one.");
    } finally {
      setZipLoading(false);
    }
  }, [bulkResults]);

  const retryBulkIndex = useCallback(
    async (index: number) => {
      const item = bulkResults[index];
      if (!item?.original || !item.error || credits <= 0) return;
      setProcessing(true);
      try {
        const resultUrl = await processFromUrl(item.original);
        const next = [...bulkResults];
        next[index] = { original: item.original, resultUrl };
        setBulkResults(next);
        setCredits((c) => Math.max(0, c - 1));
      } catch (error) {
        const next = [...bulkResults];
        next[index] = {
          ...item,
          error: error instanceof Error ? error.message : "Retry failed",
        };
        setBulkResults(next);
      } finally {
        setProcessing(false);
      }
    },
    [bulkResults, credits, processFromUrl]
  );

  const onAnonymousDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setAnonymousError(null);
    setAnonymousProcessing(true);
    setAnonymousResult(null);
    track("upload_started", { count: 1 });
    track("job_created", { mode: "amazon", nb_images: 1 });
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/process-anonymous", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 403) {
          setAnonymousError("used");
        } else {
          setAnonymousError(data.error || "Processing failed");
        }
        return;
      }
      const url = data.resultUrl ?? data.processedUrl;
      if (url) {
        setAnonymousResult(url);
        track("job_succeeded", { mode: "amazon" });
      } else {
        setAnonymousError(data.error || "No result");
      }
    } catch (e) {
      setAnonymousError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setAnonymousProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: MAX_BULK,
    maxSize: 5 * 1024 * 1024,
    disabled: !user || credits <= 0 || processing,
  });

  const { getRootProps: getAnonRootProps, getInputProps: getAnonInputProps } = useDropzone({
    onDrop: onAnonymousDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: anonymousProcessing,
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
    if (anonymousResult) {
      return (
        <div className="space-y-6 rounded-xl border-2 border-zinc-200 bg-gray-50 p-8">
          <p className="text-center text-lg font-semibold text-zinc-800">Your result (white background)</p>
          <div className="mx-auto flex max-w-sm justify-center rounded-lg border border-zinc-200 bg-white p-2">
            <img src={anonymousResult} alt="Processed Amazon product photo with white background" className="max-h-80 w-full object-contain" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={anonymousResult}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Download HD
            </a>
            <div className="w-full text-center">
              <p className="mb-3 text-sm font-medium text-zinc-700">
                Create an account to get 2 more free images (3 total).
              </p>
              <SignInWithGoogleButton />
              <p className="mt-2 text-sm text-zinc-500">
                or <Link href="/login" className="underline hover:text-zinc-700">other sign-in options</Link>
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (anonymousError === "used") {
      return (
        <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-gray-50 p-8 text-center">
          <p className="mb-1 text-lg font-semibold text-zinc-800">
            You&apos;ve used your 1 free image
          </p>
          <p className="mb-6 text-sm text-zinc-600">
            Create an account to get 2 more free images (3 total). No credit card.
          </p>
          <SignInWithGoogleButton />
          <p className="mt-3 text-sm text-zinc-500">
            or <Link href="/login" className="underline hover:text-zinc-700">other sign-in options</Link>
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-gray-50 p-8 text-center">
        <p className="mb-1 text-lg font-semibold text-zinc-800">
          Try 1 free image (no account)
        </p>
        <p className="mb-6 text-sm text-zinc-600">
          Drag an image below. We&apos;ll remove the background. Then create an account to get 2 more free.
        </p>
        <div
          {...getAnonRootProps()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-400 bg-white p-10 transition-colors hover:border-emerald-400 hover:bg-emerald-50/50"
        >
          <input {...getAnonInputProps()} />
          {anonymousProcessing ? (
            <p className="font-medium text-blue-600">Processing your image… (~3 s)</p>
          ) : (
            <>
              <p className="mb-1 font-medium text-zinc-700">Drop an image here or click</p>
              <p className="text-sm text-zinc-500">JPG, PNG, WebP (max 5 MB)</p>
            </>
          )}
        </div>
        {anonymousError && anonymousError !== "used" && (
          <p className="mt-3 text-sm text-amber-600">{anonymousError}</p>
        )}
        <p className="mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-zinc-700">Sign in</Link>
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

  const creditsForMode = CREDITS_PER_MODE[mode];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-1 gap-0.5">
          {[
            { key: "amazon" as ProcessMode, label: "🏷️ Amazon", sub: "White BG" },
            { key: "lifestyle" as ProcessMode, label: "🖼️ Lifestyle", sub: "Scene" },
            { key: "upscale" as ProcessMode, label: "📐 Upscale", sub: "HD/4K" },
            { key: "transparent" as ProcessMode, label: "🔲 Transparent", sub: "PNG" },
          ].map(({ key, label, sub }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${mode === key
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              <span className="block">{label}</span>
              <span className="block text-[10px] font-normal text-zinc-400">{sub}</span>
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-zinc-700">
          Credits: {credits} {creditsForMode > 1 && <span className="text-xs text-zinc-500">({creditsForMode} per image)</span>}
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

      {/* Lifestyle options */}
      {mode === "lifestyle" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-800 mb-2">Choose a scene preset:</label>
            <div className="flex flex-wrap gap-2">
              {SCENE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => { setSceneDescription(preset.value); setCustomScene(""); }}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${sceneDescription === preset.value && !customScene.trim()
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-800 mb-1">Or describe your own scene:</label>
            <input
              type="text"
              value={customScene}
              onChange={(e) => setCustomScene(e.target.value)}
              placeholder="e.g. on a beach towel with ocean in the background"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {customScene.trim() && (
              <p className="mt-1 text-xs text-emerald-600">✓ Using your custom scene description</p>
            )}
          </div>
          <p className="text-xs text-zinc-500">💡 Tip: Upload your product photo, and the AI will place it in the scene you describe. Best with a product on a plain background.</p>
        </div>
      )}

      {/* Upscale options */}
      {mode === "upscale" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
          <label className="block text-sm font-semibold text-zinc-800 mb-3">Upscale factor:</label>
          <div className="flex gap-3">
            {[2, 4].map((factor) => (
              <button
                key={factor}
                type="button"
                onClick={() => setUpscaleFactor(factor)}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-center font-bold transition-all ${upscaleFactor === factor
                  ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-blue-400"
                  }`}
              >
                {factor}x
                <span className="block text-xs font-normal mt-0.5">{
                  factor === 2 ? "Double resolution" : "Quadruple resolution"
                }</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">📐 Perfect for images that don&apos;t meet Amazon&apos;s 1000px minimum requirement.</p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-zinc-300 bg-gray-50 hover:border-zinc-400"
          } ${processing ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        {processing ? (
          <div className="font-medium text-blue-600">
            <p>{bulkTotal > 0 ? `Processing image ${bulkIndex} of ${bulkTotal}…` : "AI processing your image…"}</p>
            <p className="mt-1 text-sm font-normal text-zinc-500">
              ~3 s/image • {processingSeconds}s elapsed
              {bulkTotal > 0 && bulkIndex < bulkTotal && (
                <> · ~{Math.max(0, (bulkTotal - bulkIndex) * 4)}s remaining</>
              )}
            </p>
            {processingSeconds >= 8 && processingSeconds < 20 && (
              <p className="mt-2 text-sm text-amber-600">
                This one is taking longer — we&apos;re still working on it.
              </p>
            )}
            {processingSeconds >= 20 && (
              <p className="mt-2 text-sm text-amber-600">
                Still working… You can leave this tab; results will be in your dashboard.
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
          <p className="mt-3 text-xs text-zinc-500">
            Cancel stops remaining jobs (already processed images stay available).
          </p>
        </div>
      )}

      {bulkResults.length > 0 && !processing && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-zinc-800">
              Bulk results ({bulkResults.length} image{bulkResults.length > 1 ? "s" : ""})
            </h3>
            <div className="flex flex-wrap gap-2">
              {bulkResults.filter((r) => r.resultUrl).length >= 2 && (
                <button
                  type="button"
                  onClick={downloadZip}
                  disabled={zipLoading}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-70"
                >
                  {zipLoading ? "Creating ZIP…" : "Download ZIP"}
                </button>
              )}
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
          </div>
          <p className="mb-4 text-xs text-zinc-500">
            Results are also saved in your dashboard.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bulkResults.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                {item.error ? (
                  <div className="mb-2 flex aspect-square flex-col items-center justify-center rounded border border-amber-200 bg-amber-50 p-2 text-center">
                    <p className="text-xs font-medium text-amber-800">Failed</p>
                    <p className="mt-1 text-xs text-amber-700 line-clamp-2">{item.error}</p>
                    <button
                      type="button"
                      onClick={() => retryBulkIndex(idx)}
                      disabled={processing || credits <= 0 || !item.original}
                      className="mt-2 rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                    >
                      Retry (1 credit)
                    </button>
                  </div>
                ) : (
                  <>
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
                          if (item.resultUrl) {
                            navigator.clipboard.writeText(item.resultUrl);
                            track("copy_link_clicked");
                            alert("Link copied!");
                          }
                        }}
                        className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Copy link
                      </button>
                    </div>
                  </>
                )}
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
                alt="Processed Amazon product photo with white background"
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
                  track("copy_link_clicked");
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
