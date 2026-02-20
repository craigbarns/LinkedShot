"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

/** Affiche le lien Dashboard uniquement si l'utilisateur est connecté (pour footer, etc.). */
export default function DashboardLinkIfAuth() {
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

  if (isAuthenticated !== true) return null;
  return (
    <li>
      <Link href="/dashboard">Dashboard</Link>
    </li>
  );
}
