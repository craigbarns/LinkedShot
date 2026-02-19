"use client";

import { useState } from "react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function ConfigBanner() {
  const [configured] = useState(() => isSupabaseConfigured());

  if (configured) return null;

  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
      <span>
        LinkedShot is not configured yet.{" "}
        <Link href="/login" className="underline">
          See instructions
        </Link>
        {" · "}
        Copy <code className="rounded bg-amber-200 px-1">.env.local.example</code> to{" "}
        <code className="rounded bg-amber-200 px-1">.env.local</code> and add your Supabase keys.
      </span>
    </div>
  );
}
