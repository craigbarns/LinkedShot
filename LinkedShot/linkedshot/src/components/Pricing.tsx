"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { track } from "@/lib/analytics";
import type { PricingPlan } from "@/types";
import { Shield, Zap, CheckCircle } from "lucide-react";

type Locale = { currency: "eur" | "usd"; symbol: string } | null;

type PricingProps = {
  plans: PricingPlan[];
};

// SSR-safe countdown timer (initializes on client only)
function useCountdown() {
  const [seconds, setSeconds] = useState<number>(2400);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("ls_ctr");
    const init = stored ? parseInt(stored) : 2400 + Math.floor(Math.random() * 600);
    if (!stored) sessionStorage.setItem("ls_ctr", String(init));
    setSeconds(init);

    const t = setInterval(() => {
      setSeconds((s) => {
        const next = Math.max(0, s - 1);
        sessionStorage.setItem("ls_ctr", String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (!mounted) return "--m --s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h}h ` : ""}${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export default function Pricing({ plans }: PricingProps) {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>(null);
  const countdown = useCountdown();

  useEffect(() => {
    fetch("/api/locale", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { currency: "eur", symbol: "€" })
      .then((data) => setLocale({ currency: data.currency ?? "eur", symbol: data.symbol ?? "€" }))
      .catch(() => setLocale({ currency: "eur", symbol: "€" }));
  }, []);

  const handleCheckout = async (planId: string) => {
    if (planId === "free") return;
    setLoadingPlanId(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          currency: locale?.currency ?? "eur",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login?redirect=" + encodeURIComponent("/#pricing");
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }
      if (data.url) {
        track("checkout_started", { planId });
        window.location.href = data.url;
      } else {
        alert("Payment link could not be created. Please try again or contact support.");
      }
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div>
      {/* Urgency banner — high contrast design */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 py-3.5">
          {/* Live dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>

          {/* Text */}
          <p className="text-sm font-medium text-white">
            🔥 Use code
          </p>

          {/* Code pill — impossible to miss */}
          <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-emerald-400 bg-emerald-500/20 px-3 py-1">
            <code className="font-mono text-base font-extrabold tracking-widest text-emerald-300">WELCOME10</code>
          </span>

          <p className="text-sm font-medium text-white">
            for <strong className="text-emerald-400">10% off</strong>
          </p>

          {/* Timer */}
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm font-bold tabular-nums text-amber-400">
            ⏱ {countdown}
          </span>
        </div>
        {/* Color bar at bottom */}
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const isPro = plan.id === "pro";
          const isStarter = plan.id === "starter";
          const isFree = plan.id === "free";

          return (
            <div
              key={plan.id}
              className={`group relative flex flex-col rounded-3xl border bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${isPro
                ? "border-emerald-400 ring-2 ring-emerald-500/20"
                : "border-zinc-200"
                }`}
            >
              {/* MOST POPULAR badge */}
              {isPro && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}
              {isStarter && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="rounded-full bg-zinc-800 px-5 py-1.5 text-xs font-bold text-white shadow">
                    BEST TO START
                  </span>
                </div>
              )}

              <h3 className="mb-1 text-lg font-bold text-zinc-900">{plan.name}</h3>

              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900">
                  {plan.price === 0
                    ? "Free"
                    : locale?.symbol === "$"
                      ? `$${plan.price}`
                      : `${plan.price}€`}
                </span>
                {plan.price > 0 && (
                  <span className="text-zinc-400">/once</span>
                )}
              </div>

              {plan.price > 0 && (
                <p className="mb-5 text-sm font-semibold text-emerald-600">
                  {locale?.symbol === "$"
                    ? `$${(plan.price / plan.credits).toFixed(2)}`
                    : `€${(plan.price / plan.credits).toFixed(2)}`}{" "}
                  per credit
                  {isPro && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                      Best value
                    </span>
                  )}
                </p>
              )}
              {plan.price === 0 && <div className="mb-5" />}

              <ul className="mb-7 flex-1 space-y-2.5 text-sm text-zinc-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
                {!isFree && (
                  <>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span>Amazon-compliant output & HD 4K</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span>Unlocks all AI lifestyle generation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span>Bulk processing & ZIP downloads</span>
                    </li>
                  </>
                )}
              </ul>

              {plan.price === 0 ? (
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-100 py-4 font-semibold text-zinc-800 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  aria-label="Sign in to get 3 free images"
                >
                  Start free →
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loadingPlanId !== null}
                  className={`btn-glow relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 ${isPro
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 focus:ring-emerald-500 text-lg"
                    : "bg-zinc-900 hover:bg-zinc-800 focus:ring-zinc-500"
                    }`}
                  aria-label={`${plan.credits} credits for ${locale?.symbol ?? "€"}${plan.price}`}
                >
                  {loadingPlanId === plan.id ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Redirecting…
                    </span>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Get {plan.credits} credits
                    </>
                  )}
                </button>
              )}

              {!isFree && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                  <Shield className="h-3 w-3" />
                  30-day money-back guarantee
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* Bottom social proof */}
      <div className="mt-10 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-5">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /> Secure Stripe checkout</span>
          <span className="flex items-center gap-2">✓ No subscription — one-time payment</span>
          <span className="flex items-center gap-2">✓ Instant delivery · credits added immediately</span>
          <span className="flex items-center gap-2">✓ 30-day money-back, no questions</span>
        </div>
      </div>
    </div>
  );
}
