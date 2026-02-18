"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const main = document.getElementById("main-content");
      const pricing = document.getElementById("pricing");
      if (!main || !pricing) return;
      const pricingTop = pricing.getBoundingClientRect().top;
      const scrolledPastHero = window.scrollY > 400;
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
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm"
      role="banner"
      aria-label="Call to action"
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-700">
          Try 3 free images · No credit card required
        </p>
        <div className="flex gap-3">
          <Link
            href="/#upload"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Upload free
          </Link>
          <Link
            href="/#pricing"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            See plans
          </Link>
        </div>
      </div>
    </div>
  );
}
