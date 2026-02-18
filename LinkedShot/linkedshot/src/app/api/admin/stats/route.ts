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

    const [{ count: totalImages }, { count: totalUsers }] = await Promise.all([
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "done"),
      supabase.from("credits").select("*", { count: "exact", head: true }),
    ]);

    const revenueSince = process.env.ADMIN_REVENUE_SINCE_DATE
      ? new Date(process.env.ADMIN_REVENUE_SINCE_DATE).getTime()
      : 0;

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
    });
  } catch (e) {
    console.error("Admin stats:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
