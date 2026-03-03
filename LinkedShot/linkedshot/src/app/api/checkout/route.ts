import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getStripe, PLANS, type PlanId } from "@/lib/stripe";

function getBaseUrl(request: NextRequest): string {
  try {
    const url = new URL(request.url);
    if (url.origin && url.origin !== "null") return url.origin;
  } catch {}
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
    console.error("Checkout: STRIPE_SECRET_KEY missing or invalid");
    return NextResponse.json(
      { error: "Payment is not configured. Please contact support." },
      { status: 503 }
    );
  }

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

    const body = await request.json();
    const { planId, currency: preferredCurrency } = body as {
      planId?: string;
      currency?: "eur" | "usd";
    };
    // Allow customer to enter a promotion code (e.g. WELCOME10) at checkout
    if (!planId || !(planId in PLANS)) {
      return NextResponse.json(
        { error: "Invalid planId. Use 'starter' or 'pro'." },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as PlanId];
    const currency = preferredCurrency === "usd" ? "usd" : "eur";
    const baseUrl = getBaseUrl(request);
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        credits: String(plan.credits),
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: plan.priceCents,
            product_data: {
              name: plan.name,
              description: `${plan.credits} images — white background, HD PNG`,
            },
          },
        },
      ],
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}&value=${plan.priceCents / 100}&currency=${currency}`,
      cancel_url: `${baseUrl}/#pricing`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout error:", e);
    const message =
      e instanceof Error ? e.message : "Checkout failed. Please try again or contact support.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
