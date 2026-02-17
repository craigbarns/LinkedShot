
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateImage } from '@/lib/fal';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        console.log('Fal Webhook Payload:', JSON.stringify(payload));

        // Check if it's training or inference completion
        const { request_id, status, payload: output } = payload;

        // Check for specific failure types
        if (status !== 'COMPLETED') {
            // 1. Check Query Params to see if it was an inference job
            const url = new URL(req.url);
            const type = url.searchParams.get('type');
            const jobId = url.searchParams.get('jobId');

            if (type === 'inference' && jobId && status === 'FAILED') {
                console.log(`Generation FAILED for Job ${jobId}. Attempting safe refund.`);

                // Safe Refund via RPC
                // We use request_id as the unique key to prevent double refunds
                const { data: refundResult, error: refundError } = await supabaseAdmin!
                    .rpc('refund_generation_credit', {
                        p_job_id: jobId,
                        p_request_id: request_id || `req_${Date.now()}`,
                        p_error_code: payload.error_code || 'UNKNOWN',
                        p_error_type: 'provider'
                    });

                if (refundError || !refundResult?.success) {
                    console.error('Refund failed or already processed:', refundError || refundResult);
                } else {
                    console.log('Credit refunded successfully.');
                }

                return NextResponse.json({ received: true });
            }

            // 2. Default: Assume Training Failure if not inference
            if (status === 'FAILED') {
                console.error(`Training Failed for request ${request_id}`);
                await supabaseAdmin!
                    .from('jobs')
                    .update({ status: 'failed' })
                    .eq('astria_model_id', request_id);
            }
            return NextResponse.json({ received: true });
        }

        // Identify if this is a training result or inference result

        // 1. Check Query Params for explicit type
        const url = new URL(req.url);
        const type = url.searchParams.get('type');
        const jobId = url.searchParams.get('jobId');

        if (type === 'inference' && jobId && output.images) {
            const imageUrl = output.images[0].url;
            console.log(`Inference complete for Job ${jobId}. Image: ${imageUrl}`);

            // Fetch current images first to append
            const { data: job } = await supabaseAdmin!
                .from('jobs')
                .select('result_images')
                .eq('id', jobId)
                .single();

            if (job) {
                const currentImages = job.result_images || [];
                // Avoid duplicates if API already saved it
                if (!currentImages.includes(imageUrl)) {
                    // Ideally: Fetch image -> Upload to Supabase Storage -> Get Public URL
                    // For MVP Phase 2: We use the Fal URL directly but log it.

                    // 1. Add to generations first (Source of Truth)
                    const { count } = await supabaseAdmin!
                        .from('generations')
                        .select('*', { count: 'exact', head: true })
                        .eq('image_url', imageUrl);

                    if (count === 0) {
                        const genRequestId = request_id || `rec_${Date.now()}`;
                        await supabaseAdmin!
                            .from('generations')
                            .insert({
                                job_id: jobId,
                                status: 'done',
                                image_url: imageUrl,
                                prompt_preset: 'webhook_recovered',
                                provider_request_id: genRequestId
                            });
                    }

                    // 2. Sync to jobs array (Legacy)
                    await supabaseAdmin!
                        .from('jobs')
                        .update({
                            result_images: [...currentImages, imageUrl],
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', jobId);


                    console.log('Saved inference image via webhook (recovered)');
                } else {
                    console.log('Image already saved via API');
                }
            }
        }

        // 2. Training Complete (Legacy logic or if type not set)
        else if (output.diffusers_lora_file) {
            const loraUrl = output.diffusers_lora_file.url;
            console.log(`Training complete for request ${request_id}. LoRA URL: ${loraUrl}`);

            // Find job by fal request id
            const { data: job, error } = await supabaseAdmin!
                .from('jobs')
                .select('*')
                .eq('astria_model_id', request_id)
                .single();

            if (error || !job) {
                console.error('Job not found for training request', request_id);
                return NextResponse.json({ error: 'Job not found' }, { status: 404 });
            }

            // Update Job Status
            await supabaseAdmin!
                .from('jobs')
                .update({
                    status: 'training_completed',
                    download_url: loraUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', job.id);

            // Update Job Model Version
            // We find the latest training job_model record or update based on version
            await supabaseAdmin!
                .from('job_models')
                .update({
                    status: 'trained',
                    lora_url: loraUrl
                })
                .eq('job_id', job.id)
                .eq('version', job.active_model_version);

            // Log Event
            await supabaseAdmin!
                .from('job_events')
                .insert({ job_id: job.id, event_type: 'training_completed', metadata: { lora_url: loraUrl, version: job.active_model_version } });
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
