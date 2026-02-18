import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(secret, {
  typescript: true,
});

export const PLANS = {
  starter: { priceCents: 900, credits: 50, name: "Starter — 50 images" },
  pro: { priceCents: 2900, credits: 200, name: "Pro — 200 images" },
} as const;

export type PlanId = keyof typeof PLANS;
