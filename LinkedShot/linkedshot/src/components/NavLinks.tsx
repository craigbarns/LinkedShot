"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function NavLinks() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    check();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      check();
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/login"
        className="text-sm font-medium text-zinc-400 transition hover:text-white"
      >
        Connexion
      </Link>
      {isAuthenticated === true && (
        <Link
          href="/dashboard"
          className="text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          Dashboard
        </Link>
      )}
      <Link
        href="/blog"
        className="text-sm font-medium text-zinc-400 transition hover:text-white"
      >
        Blog
      </Link>
      <Link
        href="/#upload"
        className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
      >
        Commencer
      </Link>
    </nav>
  );
}
