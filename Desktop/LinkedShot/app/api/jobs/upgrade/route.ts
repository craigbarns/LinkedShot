
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
        }

        // 1. Verify Job Eligiblity
        const { data: job, error } = await supabaseAdmin!
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (error || !job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        if (job.plan !== 'starter') {
            return NextResponse.json({ error: 'Only Starter plans can upgrade to Pro' }, { status: 400 });
        }

        // 2. Create Upgrade Session (One-Click Flow)
        // We use a fixed price difference of $20 (2000 cents)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Upgrade to Professional Pack ⚡️',
                            description: 'Unlocks 4K Resolution, Editorial Mode, Priority Processing & More Styles.',
                            images: ['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=400'], // Premium image
                        },
                        unit_amount: 2000, // $20.00 Upgrade Price
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/status?jobId=${jobId}&upgraded=true`,
            cancel_url: `${req.headers.get('origin')}/status?jobId=${jobId}`,
            client_reference_id: jobId,
            metadata: {
                service: 'linkedshot',
                type: 'upgrade',
                jobId: jobId,
                new_plan: 'pro'
            },
            customer_email: job.customer_email || undefined // Pre-fill email for 1-click feel
        });

        return NextResponse.json({ url: session.url });

    } catch (err: any) {
        console.error('Upgrade Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
