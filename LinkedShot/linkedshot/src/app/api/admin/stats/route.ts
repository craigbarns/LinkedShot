import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = process.env.ADMIN_EMAIL;
  if (!allowed) return false;
  const emails = allowed.split(",").map((e) => e.trim().toLowerCase());
  return emails.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  try {
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user || !isAdmin(user.email ?? undefined)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServiceRoleClient();

    const since = new Date();
    since.setDate(since.getDate() - 14);
    since.setUTCHours(0, 0, 0, 0);
    const sinceIso = since.toISOString();

    const [{ count: totalImages }, { count: totalUsers }, visitsRes, jobsRes] = await Promise.all([
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "done"),
      supabase.from("credits").select("*", { count: "exact", head: true }),
      supabase.from("visits").select("created_at").gte("created_at", sinceIso),
      supabase
        .from("jobs")
        .select("created_at, used_free_credit, user_id")
        .eq("status", "done")
        .gte("created_at", sinceIso),
    ]);

    type DayRow = { date: string; visitors: number; generations: number; freeGenerations: number; activeUsers: number };
    const dayMap = new Map<string, { visitors: number; generations: number; freeGenerations: number; userIds: Set<string> }>();

    for (let d = 0; d < 14; d++) {
      const dte = new Date(since);
      dte.setDate(dte.getDate() + d);
      const key = dte.toISOString().slice(0, 10);
      dayMap.set(key, { visitors: 0, generations: 0, freeGenerations: 0, userIds: new Set() });
    }

    for (const v of visitsRes.data ?? []) {
      const key = (v.created_at as string).slice(0, 10);
      const row = dayMap.get(key);
      if (row) row.visitors += 1;
    }

    for (const j of jobsRes.data ?? []) {
      const key = (j.created_at as string).slice(0, 10);
      const row = dayMap.get(key);
      if (row) {
        row.generations += 1;
        if ((j as { used_free_credit?: boolean }).used_free_credit) row.freeGenerations += 1;
        if (j.user_id) row.userIds.add(j.user_id);
      }
    }

    const dailyStats: DayRow[] = Array.from(dayMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, row]) => ({
        date,
        visitors: row.visitors,
        generations: row.generations,
        freeGenerations: row.freeGenerations,
        activeUsers: row.userIds.size,
      }));

    // Ne compter que les ventes à partir de cette date (par défaut 2026-02-19)
    const revenueSinceDateStr = process.env.ADMIN_REVENUE_SINCE_DATE?.trim() || "2026-02-19";
    const revenueSince = new Date(revenueSinceDateStr).getTime();

    let revenueCents = 0;
    let totalSales = 0;
    let recentSales: { date: string; amount: number; plan: string; credits: number }[] = [];
    try {
      const stripe = getStripe();
      const sessions = await stripe.checkout.sessions.list({
        status: "complete",
        limit: 100,
      });
      for (const s of sessions.data) {
        const createdMs = (s.created ?? 0) * 1000;
        if (createdMs < revenueSince) continue;
        const amount = s.amount_total ?? 0;
        revenueCents += amount;
        totalSales += 1;
        recentSales.push({
          date: new Date(createdMs).toISOString().slice(0, 10),
          amount: amount / 100,
          plan: (s.metadata?.plan_id as string) ?? "—",
          credits: parseInt(s.metadata?.credits ?? "0", 10),
        });
      }
      recentSales.sort((a, b) => (b.date > a.date ? 1 : -1));
      recentSales = recentSales.slice(0, 20);
    } catch (e) {
      console.error("Admin stats Stripe:", e);
    }

    return NextResponse.json({
      totalImages: totalImages ?? 0,
      totalUsers: totalUsers ?? 0,
      totalSales,
      revenueCents,
      revenueEuros: Math.round((revenueCents / 100) * 100) / 100,
      recentSales,
      revenueSinceDate: revenueSinceDateStr,
      dailyStats,
    });
  } catch (e) {
    console.error("Admin stats:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
