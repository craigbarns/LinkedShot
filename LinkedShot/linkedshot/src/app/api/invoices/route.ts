import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
    });

    const forUser = sessions.data.filter(
      (s) => (s.client_reference_id ?? s.metadata?.user_id) === user.id
    );

    const invoices: {
      id: string;
      date: string;
      amount: number;
      currency: string;
      plan: string;
      receipt_url: string | null;
    }[] = [];

    for (const session of forUser) {
      let receipt_url: string | null = null;
      const piId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
      if (piId) {
        const pi = await stripe.paymentIntents.retrieve(piId, {
          expand: ["latest_charge"],
        });
        const charge = pi.latest_charge as Stripe.Charge | undefined;
        receipt_url = charge?.receipt_url ?? null;
      }

      const amount = session.amount_total ?? 0;
      const currency = (session.currency ?? "eur").toUpperCase();
      invoices.push({
        id: session.id,
        date: new Date((session.created ?? 0) * 1000).toISOString().slice(0, 10),
        amount: amount / 100,
        currency,
        plan: (session.metadata?.plan_id as string) ?? "—",
        receipt_url,
      });
    }

    invoices.sort((a, b) => (b.date > a.date ? 1 : -1));

    return NextResponse.json({ invoices });
  } catch (e) {
    console.error("Invoices error:", e);
    return NextResponse.json(
      { error: "Failed to load invoices" },
      { status: 500 }
    );
  }
}
