import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Webhook signature verification failed:", message);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id ?? session.client_reference_id;
    const creditsToAdd = session.metadata?.credits
      ? parseInt(session.metadata.credits, 10)
      : 0;

    if (!userId || !creditsToAdd || Number.isNaN(creditsToAdd)) {
      console.error("Webhook: missing user_id or credits", session.metadata);
      return NextResponse.json(
        { error: "Invalid session metadata" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data: row, error: fetchError } = await supabase
      .from("credits")
      .select("amount")
      .eq("user_id", userId)
      .single();

    if (fetchError || !row) {
      console.error("Webhook: credits row not found for user", userId, fetchError);
      return NextResponse.json(
        { error: "User credits not found" },
        { status: 500 }
      );
    }

    const newAmount = row.amount + creditsToAdd;
    const { error: updateError } = await supabase
      .from("credits")
      .update({
        amount: newAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Webhook: failed to update credits", updateError);
      return NextResponse.json(
        { error: "Failed to add credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true, creditsAdded: creditsToAdd });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
