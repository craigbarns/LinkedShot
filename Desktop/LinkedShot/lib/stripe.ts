
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build';

export const stripe = new Stripe(stripeKey, {
    typescript: true,
});
