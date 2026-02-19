"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ImageIcon,
  Users,
  Euro,
  TrendingUp,
  LogOut,
  ArrowLeft,
  Calendar,
  Eye,
  Zap,
  Gift,
} from "lucide-react";

type DayStat = {
  date: string;
  visitors: number;
  generations: number;
  freeGenerations: number;
  activeUsers: number;
};

type Stats = {
  totalImages: number;
  totalUsers: number;
  totalSales: number;
  revenueCents: number;
  revenueEuros: number;
  recentSales: { date: string; amount: number; plan: string; credits: number }[];
  revenueSinceDate?: string | null;
  dailyStats?: DayStat[];
} | null;

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        if (res.status === 403) {
          router.replace("/admin/login?next=/admin");
          return;
        }
        if (!res.ok) {
          setError("Failed to load stats");
          return;
        }
        const data = await res.json();
        setStats(data);
      } catch {
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-red-600">{error ?? "No data"}</p>
        <Link href="/" className="ml-4 text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900"
            >
              <ArrowLeft className="h-5 w-5" />
              Home
            </Link>
            <span className="text-xl font-bold text-zinc-900">Admin</span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900">Dashboard</h1>

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  Images processed
                </p>
                <p className="text-2xl font-bold text-zinc-900">
                  {stats.totalImages.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Users</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-3">
                <Euro className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Revenue</p>
                <p className="text-2xl font-bold text-zinc-900">
                  €{stats.revenueEuros.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </p>
                {stats.revenueSinceDate && (
                  <p className="mt-1 text-xs text-zinc-400">
                    Depuis le {stats.revenueSinceDate}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Sales (last 100)</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {stats.totalSales}
                </p>
              </div>
            </div>
          </div>
        </div>

        {stats.dailyStats && stats.dailyStats.length > 0 && (
          <section className="mb-10 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-zinc-200 px-6 py-4 text-lg font-semibold text-zinc-900">
              <Calendar className="h-5 w-5 text-zinc-500" />
              Statistiques journalières (14 derniers jours)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-6 py-3 font-medium text-zinc-700">Date</th>
                    <th className="px-6 py-3 font-medium text-zinc-700">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> Visiteurs
                      </span>
                    </th>
                    <th className="px-6 py-3 font-medium text-zinc-700">
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4" /> Générations
                      </span>
                    </th>
                    <th className="px-6 py-3 font-medium text-zinc-700">
                      <span className="flex items-center gap-1">
                        <Gift className="h-4 w-4" /> Générations free
                      </span>
                    </th>
                    <th className="px-6 py-3 font-medium text-zinc-700">Utilisateurs actifs</th>
                  </tr>
                </thead>
                <tbody>
                  {[...stats.dailyStats].reverse().map((day) => (
                    <tr
                      key={day.date}
                      className="border-b border-zinc-100 hover:bg-zinc-50"
                    >
                      <td className="px-6 py-3 font-medium text-zinc-900">
                        {(() => {
                          const d = new Date(day.date + "T12:00:00.000Z");
                          return isNaN(d.getTime())
                            ? day.date
                            : d.toLocaleDateString("fr-FR", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                        })()}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {day.visitors.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {day.generations.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {day.freeGenerations.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {day.activeUsers.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          <h2 className="border-b border-zinc-200 px-6 py-4 text-lg font-semibold text-zinc-900">
            Recent sales
          </h2>
          <div className="overflow-x-auto">
            {stats.recentSales.length === 0 ? (
              <p className="px-6 py-8 text-center text-zinc-500">
                No sales yet
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-6 py-3 font-medium text-zinc-700">Date</th>
                    <th className="px-6 py-3 font-medium text-zinc-700">Plan</th>
                    <th className="px-6 py-3 font-medium text-zinc-700">Credits</th>
                    <th className="px-6 py-3 font-medium text-zinc-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSales.map((sale, i) => (
                    <tr
                      key={i}
                      className="border-b border-zinc-100 hover:bg-zinc-50"
                    >
                      <td className="px-6 py-3 text-zinc-600">{sale.date}</td>
                      <td className="px-6 py-3 font-medium text-zinc-900">
                        {sale.plan}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">{sale.credits}</td>
                      <td className="px-6 py-3 font-medium text-zinc-900">
                        €{sale.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
