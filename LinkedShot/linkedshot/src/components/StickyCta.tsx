"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pricing = document.getElementById("pricing");
      if (!pricing) return;
      const pricingTop = pricing.getBoundingClientRect().top;
      const scrolledPastHero = window.scrollY > 600;
      const notYetAtPricing = pricingTop > 120;
      setVisible(scrolledPastHero && notYetAtPricing);
      setCompact(window.scrollY > 1200);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="sticky-slide fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[var(--dark-bg)]/97 px-4 shadow-2xl shadow-black/60 backdrop-blur-xl"
      role="banner"
      aria-label="Call to action"
    >
      {/* Gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

      <div className={`mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 ${compact ? "py-2.5" : "py-3.5"}`}>
        {compact ? (
          <p className="text-sm font-medium text-zinc-400 hidden sm:block">
            🎁 Code <code className="rounded bg-zinc-800 px-1 text-emerald-400 font-mono text-xs">WELCOME10</code> → 10% off
          </p>
        ) : (
          <div>
            <p className="text-sm font-bold text-white">Try LinkedShot AI Studio free — no credit card</p>
            <p className="text-xs text-zinc-500">3 free credits · AI Lifestyle · 4K Upscale · White Backgrounds</p>
          </div>
        )}
        <div className="flex gap-2.5">
          <Link
            href="/#upload"
            className="btn-glow inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            <Zap className="h-3.5 w-3.5" />
            Try free
          </Link>
          <Link
            href="/#pricing"
            className="rounded-xl border border-zinc-600 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
