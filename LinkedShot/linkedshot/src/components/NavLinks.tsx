"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Zap } from "lucide-react";

export default function NavLinks() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);

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

    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToUpload = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="flex items-center gap-3">
      {/* Pricing link */}
      <Link
        href="/#pricing"
        className="hidden text-sm font-medium text-zinc-400 transition hover:text-white sm:block"
      >
        Pricing
      </Link>

      {isAuthenticated === true ? (
        <Link
          href="/dashboard"
          className="text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href="/login"
          className="hidden text-sm font-medium text-zinc-400 transition hover:text-white sm:block"
        >
          Sign In
        </Link>
      )}

      <Link
        href="/blog"
        className="hidden text-sm font-medium text-zinc-400 transition hover:text-white md:block"
      >
        Blog
      </Link>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={scrollToUpload}
        className={`inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[var(--dark-bg)] ${scrolled ? "shadow-lg shadow-emerald-500/30" : ""
          }`}
      >
        <Zap className="h-3.5 w-3.5" />
        <span className="hidden sm:block">Try free</span>
        <span className="sm:hidden">Free</span>
      </button>
    </nav>
  );
}
