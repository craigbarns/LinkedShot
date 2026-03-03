"use client";

import { Shield, CreditCard, RotateCcw } from "lucide-react";

type Variant = "dark" | "light";

export default function TrustBadges({ variant = "light" }: { variant?: Variant }) {
  const isDark = variant === "dark";
  const textClass = isDark ? "text-zinc-400" : "text-zinc-600";
  const items = [
    { icon: CreditCard, label: "Secure payment (Stripe)" },
    { icon: Shield, label: "Amazon compliant" },
    { icon: RotateCcw, label: "30-day guarantee" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-2 text-sm ${textClass}`}
        >
          <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          {label}
        </span>
      ))}
    </div>
  );
}
