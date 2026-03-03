"use client";

import { Star, Zap, Shield } from "lucide-react";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[var(--dark-bg)] px-4 pt-24 pb-20">
      {/* Gradient orbs */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full opacity-30 blur-[100px]"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-20 blur-[120px]"
        style={{ background: "#06b6d4" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
          <Zap className="h-4 w-4" />
          3 free images · No credit card
        </p>

        <h1
          id="hero-heading"
          className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Pro photos
          <br />
          <span
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ backgroundSize: "200% auto" }}
          >
            in seconds
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Amazon white background, transparent PNG, soon lifestyle & headshots.
          Upload → HD PNG in ~3 seconds. No Photoshop.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => scrollTo("upload")}
            className="btn-glow group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-10 py-5 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/40 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[var(--dark-bg)]"
            aria-label="Get 3 free images"
          >
            Get 3 free images →
          </button>
          <button
            type="button"
            onClick={() => scrollTo("examples")}
            className="rounded-2xl border-2 border-zinc-600 bg-transparent px-10 py-5 text-lg font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-white/5"
          >
            See before / after
          </button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Pure white #FFFFFF
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            HD PNG
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            No watermark
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            ~3 sec per image
          </span>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Shield className="h-4 w-4 text-emerald-500/80" />
          State-of-the-art AI · Same tech as top marketplaces
        </p>
      </div>
    </section>
  );
}
