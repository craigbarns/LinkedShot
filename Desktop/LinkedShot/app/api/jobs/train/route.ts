
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { startFalTraining } from '@/lib/fal';

export async function POST(req: Request) {
    console.log('[Train API] Request received');

    try {
        const body = await req.json();
        const { jobId, zipUrl } = body;
        console.log('[Train API] Payload:', { jobId, zipUrl });

        if (!jobId || !zipUrl) {
            console.error('[Train API] Missing jobId or zipUrl');
            return NextResponse.json({ error: 'Missing Job ID or Zip URL' }, { status: 400 });
        }

        // 1. Check Admin Client
        if (!supabaseAdmin) {
            console.error('[Train API] Supabase Admin client not initialized');
            return NextResponse.json({ error: 'Server Configuration Error: Admin access missing' }, { status: 500 });
        }

        // 2. Fetch Job
        const { data: job, error: jobError } = await supabaseAdmin
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (jobError || !job) {
            console.error('[Train API] Job not found:', jobError);
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        console.log('[Train API] Job Status:', job.status);

        // Allow 'paid' (new job) or 'redo_uploading' (redo job)
        if (job.status !== 'paid' && job.status !== 'redo_uploading') {
            return NextResponse.json({ error: `Payment or Redo Init required. Job status is ${job.status}` }, { status: 402 });
        }

        // 3. Trigger Fal with "SUBJECT" trigger (Human training)
        const triggerWord = `subject-${jobId.substring(0, 8)}`;
        console.log(`[Train API] Triggering Fal for ${triggerWord} with zip ${zipUrl}`);

        // Note: We removed the HEAD check because Signed URLs are often bound to GET method.
        // Sending a HEAD request would cause a SignatureDoesNotMatch error.

        const falResult = await startFalTraining(zipUrl, triggerWord);
        console.log('[Train API] Fal Response:', falResult);

        // 4. Update Job & Create Model Record
        const { error: updateError } = await supabaseAdmin
            .from('jobs')
            .update({
                status: 'training',
                astria_model_id: falResult.request_id,
                astria_prompt_id: triggerWord
            })
            .eq('id', jobId);

        // Track model version in job_models
        await supabaseAdmin.from('job_models').insert({
            job_id: jobId,
            version: job.active_model_version || 1,
            status: 'training',
            // lora_url will be updated on completion
        });

        if (updateError) {
            console.error('[Train API] DB Update Error:', updateError);
            throw new Error('Failed to update job status');
        }

        return NextResponse.json({ success: true, requestId: falResult.request_id });

    } catch (err: any) {
        console.error('[Train API] Critical Error:', err);
        // Ensure we return a strict string error, not an Error object that creates {} in JSON
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
