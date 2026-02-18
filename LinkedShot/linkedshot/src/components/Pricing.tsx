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
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login?redirect=" + encodeURIComponent("/#pricing");
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          <div className="-z-10 absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 transition-opacity group-hover:opacity-100" />
          {plan.id === "pro" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                MOST POPULAR
              </span>
            </div>
          )}
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {plan.name}
          </h3>
          <div className="mb-4 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {plan.price === 0
                ? "0"
                : locale?.symbol === "$"
                  ? `$${plan.price}`
                  : `${plan.price}€`}
            </span>
            <span className="text-gray-500">
              / {plan.credits} image{plan.credits > 1 ? "s" : ""}
            </span>
          </div>
          <ul className="mb-8 space-y-3 text-sm text-gray-600">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                ✓ {f}
              </li>
            ))}
          </ul>
          {plan.price === 0 ? (
            <Link
              href="/login"
              className="flex w-full transform items-center justify-center rounded-xl bg-black py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Sign in to get 3 free images"
            >
              Start free
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingPlanId !== null}
              className="flex w-full transform items-center justify-center rounded-xl bg-black py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              aria-label={`Get ${plan.credits} images for ${locale?.symbol ?? "€"}${plan.price}`}
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
