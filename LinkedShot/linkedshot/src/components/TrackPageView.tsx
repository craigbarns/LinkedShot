"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

export default function TrackPageView() {
  const pathname = usePathname();
  const pricingSent = useRef(false);

  useEffect(() => {
    if (pathname === "/") {
      track("landing_view");
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const el = document.getElementById("pricing");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || pricingSent.current) return;
        pricingSent.current = true;
        track("pricing_viewed");
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);

  return null;
}
