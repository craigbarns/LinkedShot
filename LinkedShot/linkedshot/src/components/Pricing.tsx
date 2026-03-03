"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { PricingPlan } from "@/types";

type Locale = { currency: "eur" | "usd"; symbol: string } | null;

type PricingProps = {
  plans: PricingPlan[];
};

export default function Pricing({ plans }: PricingProps) {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>(null);

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
        window.location.href = data.url;
      } else {
        console.error("Checkout: no URL in response", data);
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
    <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`group relative rounded-3xl border bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
            plan.id === "pro"
              ? "border-emerald-300 ring-2 ring-emerald-500/20"
              : "border-zinc-200"
          }`}
        >
          {plan.id === "pro" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                MOST POPULAR
              </span>
            </div>
          )}
          <h3 className="mb-2 text-lg font-bold text-zinc-900">{plan.name}</h3>
          <div className="mb-2 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-zinc-900">
              {plan.price === 0
                ? "0"
                : locale?.symbol === "$"
                  ? `$${plan.price}`
                  : `${plan.price}€`}
            </span>
            <span className="text-zinc-500">
              / {plan.credits} image{plan.credits > 1 ? "s" : ""}
            </span>
          </div>
          {plan.price > 0 && (
            <p className="mb-6 text-xs text-emerald-600 font-medium">
              {locale?.symbol === "$"
                ? `$${(plan.price / plan.credits).toFixed(2)} per image`
                : `€${(plan.price / plan.credits).toFixed(2)} per image`}
            </p>
          )}
          {plan.price === 0 && <div className="mb-6" />}
          <ul className="mb-8 space-y-3 text-sm text-zinc-600">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> {f}
              </li>
            ))}
          </ul>
          {plan.price === 0 ? (
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-2xl bg-zinc-900 py-4 font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label="Sign in to get 3 free images"
            >
              Start free
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingPlanId !== null}
              className={`flex w-full items-center justify-center rounded-2xl py-4 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 ${
                plan.id === "pro"
                  ? "bg-emerald-500 hover:bg-emerald-400 focus:ring-emerald-500"
                  : "bg-zinc-900 hover:bg-zinc-800 focus:ring-zinc-500"
              }`}
              aria-label={`${plan.credits} images pour ${locale?.symbol ?? "€"}${plan.price}`}
            >
              {loadingPlanId === plan.id
                ? "Redirecting…"
                : plan.id === "starter"
                  ? "Get 50 images"
                  : "Get 200 images"}
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
