
import { NextResponse } from 'next/server';
import fal from '@fal-ai/serverless-client';
import { supabaseAdmin } from '@/lib/supabase';
import { getStyleById } from '@/lib/styles';

// Helper to disable webhook locally
const getWebhook = (jobId: string) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    return (appUrl && !appUrl.includes('localhost'))
        ? `${appUrl}/api/webhooks/fal?jobId=${jobId}&type=inference`
        : undefined;
};

export async function POST(req: Request) {
    try {
        const { jobId, styleId, customPrompt } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
        }

        // 1. Fetch Job to get Lora URL
        const { data: job, error } = await supabaseAdmin!
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (error || !job || !job.download_url) { // We store Lora URL in download_url for MVP
            return NextResponse.json({ error: 'Job not ready or model missing' }, { status: 400 });
        }

        const loraUrl = job.download_url;
        // Fallback checks for old "dog" jobs vs new "subject" jobs
        // If the job was trained with the old code, it might have 'dog-'. New ones will have 'subject-'.
        // We use what's in DB, or fallback to subject-ID.
        const triggerWord = job.astria_prompt_id || `subject-${jobId.substring(0, 8)}`;

        const plan = job.plan || 'starter'; // Default to starter if column missing
        const isPro = plan === 'pro' || plan === 'teams';

        // --- CREDIT CHECK & DEDUCT (Atomic) ---
        // We decrement first to prevent spam. If gen fails, we can refund (or just keep it simple for MVP).
        const creditsTotal = job.credits_total || (plan === 'starter' ? 40 : 100);

        // Atomic update: only proceed if credits_used < credits_total
        const { data: updatedJob, error: creditError } = await supabaseAdmin!
            .rpc('increment_credits', { job_id: jobId, total_limit: creditsTotal });

        if (creditError || !updatedJob) {
            return NextResponse.json({ error: 'Credit limit reached or database error.' }, { status: 402 });
        }

        // Snapshot settings for this generation
        const generationSettings = {
            quality: isPro ? 'high_fidelity' : 'standard',
            steps: isPro ? 50 : 35,
            guidance: isPro ? 3.5 : 3.0,
            size: isPro ? "square_hd" : "portrait_4_3"
        };

        // --- STYLE LOGIC ---
        let finalPrompt = '';
        let negativePrompt = '';
        const style = styleId ? getStyleById(styleId) : null;

        // Global Modifiers for realism
        let REALISM_MODIFIERS = ", professional photography, 85mm lens, sharp focus, high-end studio photography, natural skin texture, confident expression, photorealistic, 8k, highly detailed";

        // Editorial Mode (Pro Only)
        if (isPro) {
            REALISM_MODIFIERS += ", editorial lighting, vogue style, depth of field, cinematic lighting, masterclass portrait";
        }

        if (style) {
            // Standard Human Portrait Strategy
            finalPrompt = style.prompt.replace('[TRIGGER]', triggerWord);

            // Allow user customization
            if (customPrompt) {
                finalPrompt += `, ${customPrompt}`;
            }

            // Add realism boosters
            finalPrompt += REALISM_MODIFIERS;

            negativePrompt = style.negative_prompt || "cartoon, illustration, anime, painting, distorted face, asymmetry, extra fingers, bad anatomy, blurry, low resolution, overprocessed skin, unnatural skin, plastic skin, deformed, ugly, bad proportions, duplicate, multiple people";
        } else {
            // Fallback (Generic Headshot)
            finalPrompt = `professional headshot of ${triggerWord}, photorealistic, 8k${REALISM_MODIFIERS}, ${customPrompt || ''}`;
            negativePrompt = "cartoon, illustration, anime, painting, distorted face, blurry";
        }

        // Apply Editorial Override if checkbox checked (and user is pro ?)
        // For now, we assume editorial checkbox sends specific style or prompt cues, 
        // but here we just bake it into the Pro plan automatically for best results.

        console.log(`Generating HEADSHOT [${plan.toUpperCase()}]: ${style?.name || 'Custom'} | Prompt: "${finalPrompt}"`);

        // 2. Call Fal Inference
        // Using Flux LoRA for Humans
        const { request_id } = await fal.queue.submit("fal-ai/flux-lora", {
            input: {
                prompt: finalPrompt,
                loras: [{ path: loraUrl, scale: 0.90 }],
                image_size: generationSettings.size,
                num_inference_steps: generationSettings.steps,
                guidance_scale: generationSettings.guidance,
                enable_safety_checker: false,
                output_format: "png",
                negative_prompt: negativePrompt
            },
            webhookUrl: getWebhook(jobId)
        });

        console.log(`[Generation] Submitted request: ${request_id} (Plan: ${plan})`);

        // Poll for result (Wait up to 60s)
        let result: any = null;
        let attempts = 0;
        while (!result && attempts < 60) {
            attempts++;
            await new Promise(r => setTimeout(r, 1000)); // Wait 1s
            const status = await fal.queue.status('fal-ai/flux-lora', { requestId: request_id });

            if (status.status === 'COMPLETED' || (status.status as string) === 'OK') {
                result = await fal.queue.result('fal-ai/flux-lora', { requestId: request_id });
            } else if ((status.status as string) === 'FAILED') {
                throw new Error('Fal generation failed');
            }
        }

        if (!result) {
            throw new Error('Generation timed out');
        }

        // 3. Extract Image URL
        const imageUrl = result.images?.[0]?.url;

        if (imageUrl) {
            // CRITICAL FIX: Re-fetch the job to get the latest result_images
            // This prevents race conditions when multiple generations finish simultaneously
            const { data: latestJob } = await supabaseAdmin!
                .from('jobs')
                .select('result_images, active_model_version')
                .eq('id', jobId)
                .single();

            const currentImages = latestJob?.result_images || [];

            // 1. Insert into 'generations' table (Bulletproof)
            await supabaseAdmin!
                .from('generations')
                .insert({
                    job_id: jobId,
                    model_version: latestJob?.active_model_version || 1,
                    status: 'done',
                    image_url: imageUrl,
                    prompt_preset: style?.id || 'custom',
                    seed: result.seed
                });

            // 2. Update Job array (Legacy compatibility + Easy frontend access)
            await supabaseAdmin!
                .from('jobs')
                .update({
                    result_images: [...currentImages, imageUrl],
                    updated_at: new Date().toISOString()
                })
                .eq('id', jobId);

            // Log Generation Event
            await supabaseAdmin!
                .from('job_events')
                .insert({ job_id: jobId, event_type: 'generation_completed', metadata: { image_url: imageUrl, style: style?.id, settings: generationSettings } });

            return NextResponse.json({ success: true, imageUrl });
        }

        return NextResponse.json({ error: 'No image generated' }, { status: 500 });

    } catch (err: any) {
        console.error('Generation Error [Server]:', err);
        if (err.body) console.error('Generation Error Body:', JSON.stringify(err.body, null, 2));

        return NextResponse.json({
            error: err.message || String(err),
            details: err.body || null
        }, { status: 500 });
    }
}
