import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Stripe client — créé au premier usage pour ne pas bloquer le build si les env vars sont absentes. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(secret, { typescript: true });
  }
  return _stripe;
}

export const PLANS = {
  starter: { priceCents: 900, credits: 50, name: "Starter — 50 images" },
  pro: { priceCents: 2900, credits: 200, name: "Pro — 200 images" },
} as const;

export type PlanId = keyof typeof PLANS;
