"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pricing = document.getElementById("pricing");
      if (!pricing) return;
      const pricingTop = pricing.getBoundingClientRect().top;
      const scrolledPastHero = window.scrollY > 500;
      const notYetAtPricing = pricingTop > 120;
      setVisible(scrolledPastHero && notYetAtPricing);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[var(--dark-bg)]/95 px-4 py-4 shadow-2xl backdrop-blur-xl"
      role="banner"
      aria-label="Call to action"
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-300">
          3 free images · No credit card
        </p>
        <div className="flex gap-3">
          <Link
            href="/#upload"
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            Upload free
          </Link>
          <Link
            href="/#pricing"
            className="rounded-xl border border-zinc-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            See pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
