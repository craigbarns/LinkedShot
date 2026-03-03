"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

const STORAGE_KEY = "linkedshot_exit_intent_shown";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">Wait — 10% off your first order</p>
          <p className="mt-2 text-zinc-400">Use code <code className="rounded bg-zinc-700 px-2 py-1 font-mono text-emerald-400">WELCOME10</code> at checkout.</p>
          <button
            type="button"
            onClick={() => {
              setShow(false);
              scrollToPricing();
            }}
            className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white hover:bg-emerald-400"
          >
            See pricing
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="mt-3 text-sm text-zinc-500 hover:text-white"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
