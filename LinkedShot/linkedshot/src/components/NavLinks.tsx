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
        className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        Sign In
      </Link>
      {isAuthenticated === true && (
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          Dashboard
        </Link>
      )}
      <Link
        href="/blog"
        className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        Blog
      </Link>
      <Link
        href="/#upload"
        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Get Started
      </Link>
    </nav>
  );
}
