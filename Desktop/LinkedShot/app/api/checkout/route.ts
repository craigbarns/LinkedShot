
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase'; // We'll need a service role client here ideally, but for now using the public one to create job record is fine if RLS allows, or better: create ID here.

// For security, it's better to create the job ID server-side here and pass it to Stripe metadata.
// But following our refined plan:
// 1. User pays
// 2. Webhook triggers -> creates Job in DB with 'paid' status
// 3. User is redirected to upload page with that Job ID.

export async function POST(req: Request) {
    try {
        const { plan = 'starter' } = await req.json();

        // Define Plans
        const PLANS = {
            starter: {
                name: 'Starter Pack (40 Photos)',
                price: 2900, // $29.00
                description: 'Standard resolution, 3 style categories, 24h turnaround.'
            },
            pro: {
                name: 'Professional Pack (100 Photos) ⚡️',
                price: 4900, // $49.00
                description: 'High-Res 4K, All styles unlocked, Editorial Mode, Priority.'
            },
            executive: {
                name: 'Executive Pack (VIP)',
                price: 9900, // $99.00
                description: '5 Profiles, Banner, Consultation, Priority Support.'
            }
        };

        const selectedPlan = PLANS[plan as keyof typeof PLANS] || PLANS.starter;

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedPlan.name,
                            description: selectedPlan.description,
                            images: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400'], // Headshot image
                        },
                        unit_amount: selectedPlan.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/upload?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
            cancel_url: `${origin}/?canceled=true`,
            metadata: {
                service: 'linkedshot',
                plan: plan, // Store plan type for webhook/generation logic
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
