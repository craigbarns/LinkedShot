"use client";

import { useState } from "react";
import { Shield, CreditCard, RotateCcw, X } from "lucide-react";

type Variant = "dark" | "light";
type ModalType = "stripe" | "guarantee" | null;

export default function TrustBadges({
  variant = "light",
  compact = false,
}: {
  variant?: Variant;
  compact?: boolean;
}) {
  const isDark = variant === "dark";
  const textClass = isDark ? "text-zinc-400" : "text-zinc-600";
  const [modal, setModal] = useState<ModalType>(null);

  const stripeLabel = "Stripe secure checkout";
  const guaranteeLabel = "30-day guarantee";

  if (compact) {
    return (
      <>
        <p className={`text-center text-sm ${textClass}`}>
          <button
            type="button"
            onClick={() => setModal("stripe")}
            className="underline decoration-dotted hover:opacity-80"
          >
            {stripeLabel}
          </button>
          {" · "}
          <span>Amazon compliant</span>
          {" · "}
          <button
            type="button"
            onClick={() => setModal("guarantee")}
            className="underline decoration-dotted hover:opacity-80"
          >
            {guaranteeLabel}
          </button>
        </p>
        {modal && (
          <TrustModal
            type={modal}
            onClose={() => setModal(null)}
            isDark={isDark}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
      <button
        type="button"
        onClick={() => setModal("stripe")}
        className={`inline-flex items-center gap-2 text-sm ${textClass} hover:opacity-80`}
      >
        <CreditCard className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        {stripeLabel}
      </button>
      <span className={`inline-flex items-center gap-2 text-sm ${textClass}`}>
        <Shield className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        Amazon compliant
      </span>
      <button
        type="button"
        onClick={() => setModal("guarantee")}
        className={`inline-flex items-center gap-2 text-sm ${textClass} hover:opacity-80`}
      >
        <RotateCcw className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        {guaranteeLabel}
      </button>
      {modal && (
        <TrustModal
          type={modal}
          onClose={() => setModal(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}

function TrustModal({
  type,
  onClose,
  isDark,
}: {
  type: "stripe" | "guarantee";
  onClose: () => void;
  isDark: boolean;
}) {
  const content =
    type === "stripe"
      ? "Payments powered by Stripe. Your card details are never stored on our servers."
      : "If you're not satisfied with your results, we refund. No hassle.";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trust-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        tabIndex={-1}
        aria-hidden
      />
      <div
        className={`relative max-w-sm rounded-2xl p-6 shadow-xl ${
          isDark ? "bg-zinc-800 text-white" : "bg-white text-zinc-900"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 id="trust-modal-title" className="pr-8 text-lg font-semibold">
          {type === "stripe" ? "Stripe secure checkout" : "30-day guarantee"}
        </h3>
        <p className={`mt-2 text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          {content}
        </p>
      </div>
    </div>
  );
}
