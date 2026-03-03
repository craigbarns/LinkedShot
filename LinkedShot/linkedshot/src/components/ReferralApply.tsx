"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

const REFERRAL_STORAGE_KEY = "linkedshot_ref";

export default function ReferralApply() {
  // Capture ?ref= from URL when user lands (e.g. from referral link)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem(REFERRAL_STORAGE_KEY, ref);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // When user is logged in and we have a stored ref, apply referral credits
  useEffect(() => {
    const run = async () => {
      if (typeof window === "undefined") return;
      const ref = sessionStorage.getItem(REFERRAL_STORAGE_KEY) || localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (!ref) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      try {
        await fetch("/api/referral/apply", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referrerId: ref }),
        });
      } finally {
        sessionStorage.removeItem(REFERRAL_STORAGE_KEY);
        localStorage.removeItem(REFERRAL_STORAGE_KEY);
      }
    };
    run();
  }, []);
  return null;
}
