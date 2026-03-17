"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

const STORAGE_KEY = "linkedshot_exit_intent_shown";
const SCROLL_KEY = "linkedshot_scroll_intent_shown";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Desktop: mouse exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(STORAGE_KEY)) {
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    // Mobile: show after 30s of browsing (if user hasn't seen it yet)
    let mobileTimer: ReturnType<typeof setTimeout>;
    if (!sessionStorage.getItem(STORAGE_KEY) && !sessionStorage.getItem(SCROLL_KEY)) {
      mobileTimer = setTimeout(() => {
        // Only show on mobile (no hover = touch device)
        if (window.matchMedia("(hover: none)").matches) {
          setShow(true);
          sessionStorage.setItem(SCROLL_KEY, "1");
        }
      }, 30000);
    }

    // Both: show after 70% scroll if not seen
    const handleScroll = () => {
      if (sessionStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(SCROLL_KEY)) return;
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.7) {
        setShow(true);
        sessionStorage.setItem(SCROLL_KEY, "1");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(mobileTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) setShow(false); }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60">
        {/* Gradient top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 py-7 text-center">
          {/* Emoji + headline */}
          <div className="mb-4 text-5xl">🎁</div>
          <h2 className="text-2xl font-extrabold text-white">
            Wait! 10% off your first order
          </h2>
          <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
            You're about to leave — grab this offer before it's gone.
          </p>

          {/* Code display */}
          <div className="my-5 flex items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/60 px-5 py-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Your exclusive code</p>
              <code className="text-2xl font-bold tracking-widest text-emerald-400">WELCOME10</code>
            </div>
          </div>

          {/* Value prop */}
          <ul className="mb-6 space-y-1.5 text-sm text-zinc-400 text-left">
            {["50 credits for ~€8.10 instead of €9", "200 credits for ~€26.10 instead of €29", "One-time payment, no subscription", "30-day money-back guarantee"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> {t}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              setShow(false);
              scrollToPricing();
            }}
            className="btn-glow w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-bold text-white text-lg hover:from-emerald-400 hover:to-teal-400 transition"
          >
            <Zap className="h-5 w-5" />
            Claim my 10% discount →
          </button>

          <button
            type="button"
            onClick={() => setShow(false)}
            className="mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition"
          >
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
