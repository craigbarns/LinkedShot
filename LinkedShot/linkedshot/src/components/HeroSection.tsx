"use client";

import { Star, Zap, Shield, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import TrustBadges from "./TrustBadges";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const REVIEWS = [
  { author: "Michael R.", role: "FBA Seller, 6-fig/year", text: "Saved $200 on my last launch. 3 days on Fiverr → 3 seconds here.", stars: 5 },
  { author: "Sarah K.", role: "Amazon seller since 2019", text: "50 images/month at $0.18 vs $5 on Fiverr. Pays itself in one batch.", stars: 5 },
  { author: "David Chen", role: "7-Figure Seller", text: "Finally pure white backgrounds every time. Amazon never rejected one.", stars: 5 },
];

const COUNTERS = [
  { value: "2,847", label: "sellers this month" },
  { value: "14,392", label: "images this week" },
  { value: "4.9/5", label: "average rating" },
];

export default function HeroSection() {
  const [sliderValue, setSliderValue] = useState(50);
  const [activeReview, setActiveReview] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Auto-rotate reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-animate slider demo
  useEffect(() => {
    if (dragging) return;
    const interval = setInterval(() => {
      setSliderValue((v) => {
        if (v <= 10) return 90;
        return v - 1.5;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [dragging]);

  const review = REVIEWS[activeReview];

  return (
    <section className="relative overflow-hidden bg-[var(--dark-bg)] px-4 pt-24 pb-16">
      {/* Background FX */}
      <div
        className="pointer-events-none absolute -left-60 top-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full opacity-15 blur-[140px]"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
        aria-hidden
      />
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: Copy */}
          <div>
            {/* Top badge */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              3 free images · No credit card · Results in ~3s
            </p>

            <h1
              id="hero-heading"
              className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl"
            >
              Amazon product
              <br />
              photos{" "}
              <span
                className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent"
              >
                in seconds
              </span>
            </h1>

            <p className="mt-5 text-lg text-zinc-400 leading-relaxed max-w-lg">
              Remove background. Pure white <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-emerald-400 font-mono">#FFFFFF</code> or transparent PNG.
              HD 1024×1024 — Amazon-compliant. No Photoshop, no photographer.
            </p>

            {/* Stats strip */}
            <div className="mt-7 flex flex-wrap gap-6">
              {COUNTERS.map((c) => (
                <div key={c.label}>
                  <p className="text-2xl font-extrabold text-white">{c.value}</p>
                  <p className="text-xs text-zinc-500">{c.label}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo("upload")}
                className="btn-glow btn-shimmer group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-500/40 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[var(--dark-bg)]"
                aria-label="Upload for 3 free images"
              >
                <Zap className="h-5 w-5" />
                Try free — 3 images
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("examples")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                See results
              </button>
            </div>

            {/* Trust micro */}
            <div className="mt-5">
              <TrustBadges variant="dark" />
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-xs text-zinc-500">
              {["Pure white #FFFFFF", "HD PNG 1024×1024", "No watermark", "~3 sec/image", "Amazon-compliant"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t}
                </span>
              ))}
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
              <Shield className="h-3.5 w-3.5 text-emerald-500/70" />
              State-of-the-art AI · 30-day money-back guarantee
            </p>
          </div>

          {/* RIGHT: Live Before/After Demo */}
          <div className="relative">
            {/* Floating "Demo" badge */}
            <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
              <span className="animate-bounce inline-block rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-500/40">
                ✨ Live demo — drag the slider
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60">
              {/* Slider comparison */}
              <div
                className="relative aspect-square cursor-ew-resize select-none"
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
                onMouseLeave={() => setDragging(false)}
                onMouseMove={(e) => {
                  if (!dragging) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  setSliderValue(Math.max(5, Math.min(95, x)));
                }}
                aria-label="Before/after comparison"
              >
                {/* AFTER (white bg) — background */}
                <div className="absolute inset-0 flex items-center justify-center bg-white p-4">
                  <img
                    src="/photos/sac-apres.png"
                    alt="After — white background by LinkedShot"
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow">
                    ✅ After (LinkedShot)
                  </span>
                </div>

                {/* BEFORE — clipped overlay */}
                <div
                  className="absolute inset-0 overflow-hidden bg-zinc-300"
                  style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                >
                  <img
                    src="/photos/sac-avant.png"
                    alt="Before — original supplier photo"
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-white shadow">
                    ❌ Before
                  </span>
                </div>

                {/* Divider line */}
                <div
                  className="absolute inset-y-0 z-10 flex items-center"
                  style={{ left: `${sliderValue}%`, transform: "translateX(-50%)" }}
                >
                  <div className="relative h-full w-0.5 bg-white/80 shadow-lg">
                    <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-2xl">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Range input for mobile */}
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={sliderValue}
                  onChange={(e) => {
                    setDragging(true);
                    setSliderValue(Number(e.target.value));
                  }}
                  onMouseUp={() => setTimeout(() => setDragging(false), 2000)}
                  onTouchEnd={() => setTimeout(() => setDragging(false), 2000)}
                  className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
                  aria-label="Drag to compare before and after"
                />
              </div>

              {/* Price comparison strip — inline, no overlap */}
              <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-5 py-3">
                <p className="text-xs text-zinc-500">vs Fiverr (€2–5/img)</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-emerald-400">€0.18</span>
                  <span className="text-xs text-zinc-500">/image</span>
                  <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">-96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
