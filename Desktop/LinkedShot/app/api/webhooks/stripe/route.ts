
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('Missing Stripe Webhook Secret');
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed.', error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.

        if (!supabaseAdmin) {
            console.error('Supabase Admin client not initialized');
            return new NextResponse('Server Error', { status: 500 });
        }

        try {
            const metadata = session.metadata || {};

            // 1. Handle UPGRADE to Pro
            if (metadata.type === 'upgrade' && metadata.jobId) {
                console.log(`Processing UPGRADE for Job ${metadata.jobId}`);

                const { data: currentJob } = await supabaseAdmin
                    .from('jobs')
                    .select('plan, upgrade_paid_at')
                    .eq('id', metadata.jobId)
                    .single();

                // Prevent Double Upgrade
                if (currentJob?.plan !== 'starter' || currentJob?.upgrade_paid_at) {
                    console.log(`Job ${metadata.jobId} already upgraded or not eligible. Skipping.`);
                    return new NextResponse(null, { status: 200 });
                }

                const { error: upgradeError } = await supabaseAdmin
                    .from('jobs')
                    .update({
                        plan: 'pro',
                        credits_total: 100, // Upgrade to full pro credits
                        high_fidelity: true, // Unlock best quality
                        upgrade_paid_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', metadata.jobId);

                if (upgradeError) {
                    console.error('Error upgrading job:', upgradeError);
                    return new NextResponse('Upgrade Database Error', { status: 500 });
                }

                // Log Event
                await supabaseAdmin
                    .from('job_events')
                    .insert({ job_id: metadata.jobId, event_type: 'upgraded_to_pro', metadata: { session_id: session.id } });

                console.log(`Job ${metadata.jobId} successfully upgraded to PRO`);

            } else {
                // 2. Handle NEW ORDER (Standard Flow)
                // Idempotency: Check if session already processed
                const { data: existingJob } = await supabaseAdmin
                    .from('jobs')
                    .select('id')
                    .eq('stripe_session_id', session.id)
                    .single();

                if (existingJob) {
                    console.log(`Session ${session.id} already processed. Skipping.`);
                    return new NextResponse(null, { status: 200 });
                }

                const plan = metadata.plan || 'starter';

                // Set initial credits based on plan
                let credits = 40;
                if (plan === 'pro') credits = 100;
                if (plan === 'executive') credits = 500; // Arbitrary high number for unlimited feel

                const { data: newJob, error } = await supabaseAdmin
                    .from('jobs')
                    .insert({
                        stripe_session_id: session.id,
                        customer_email: session.customer_details?.email,
                        amount_paid: session.amount_total,
                        status: 'paid', // Initial status after payment
                        plan: plan,
                        credits_total: credits,
                        high_fidelity: plan !== 'starter', // Starter is false, others true
                        created_at: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('Error inserting job into Supabase:', error);
                    return new NextResponse('Database Error', { status: 500 });
                }

                // Log Event
                if (newJob) {
                    await supabaseAdmin
                        .from('job_events')
                        .insert({ job_id: newJob.id, event_type: 'paid', metadata: { plan, session_id: session.id } });
                }

                console.log(`Job created for session ${session.id} with plan ${plan}`);
            }

        } catch (err) {
            console.error('Error processing webhook:', err);
            return new NextResponse('Server Error', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
