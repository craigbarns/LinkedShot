"use client";

import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";

function getSupabaseAndError(): {
  supabase: SupabaseClient | null;
  configError: string | null;
} {
  try {
    return { supabase: createClient(), configError: null };
  } catch (err) {
    return {
      supabase: null,
      configError:
        err instanceof Error ? err.message : "Supabase not configured.",
    };
  }
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [{ supabase, configError }] = useState(getSupabaseAndError);
  const [showEmailLink, setShowEmailLink] = useState(false);

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : undefined;

  const handleGoogleSignIn = () => {
    if (!supabase) return;
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo ?? window.location.origin },
    });
  };

  if (configError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">Missing configuration</p>
          <p className="mt-1 text-sm">{configError}</p>
          <p className="mt-2 text-sm">
            Copy{" "}
            <code className="rounded bg-amber-100 px-1">.env.local.example</code>{" "}
            to <code className="rounded bg-amber-100 px-1">.env.local</code>{" "}
            then restart{" "}
            <code className="rounded bg-amber-100 px-1">npm run dev</code>.
          </p>
        </div>
        <Link
          href="/"
          className="mt-6 text-zinc-600 underline hover:text-zinc-900"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold text-zinc-900">
            LinkedShot
          </Link>
          <Link href="/" className="text-zinc-600 hover:text-zinc-900">
            Back
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">
            Sign in to LinkedShot
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            One click to continue with Google and process your images.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-zinc-50"
          >
            <GoogleIcon />
            <span className="font-medium">Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEmailLink(!showEmailLink)}
            className="mt-4 w-full text-center text-sm text-zinc-500 underline hover:text-zinc-700"
          >
            {showEmailLink ? "Hide" : "Sign in with email (magic link)"}
          </button>

          {showEmailLink && (
            <div className="mt-6 border-t border-zinc-100 pt-6">
              <Auth
                supabaseClient={supabase}
                view="magic_link"
                appearance={{ theme: ThemeSupa }}
                theme="light"
                showLinks={false}
                providers={[]}
                redirectTo={redirectTo}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
