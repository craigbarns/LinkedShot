"use client";

import { useEffect } from "react";

const VISIT_KEY = "linkedshot_visit";

export function TrackVisit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(VISIT_KEY)) return;
      fetch("/api/track-visit", { method: "POST", credentials: "include" }).then(
        () => sessionStorage.setItem(VISIT_KEY, "1")
      );
    } catch {
      // ignore
    }
  }, []);
  return null;
}
