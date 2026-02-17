
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request, { params }: { params: Promise<{ jobId: string }> }) {
    try {
        const { jobId } = await params;

        // 1. Fetch Job
        const { data: job, error } = await supabaseAdmin!
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (error || !job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // 2. Validate Redo Eligibility
        if (!job.redo_available) {
            return NextResponse.json({ error: 'Free redo already used or responsible not available.' }, { status: 403 });
        }

        // 3. Atomically Archive & Reset
        // - Archive current model to job_models (if exists)
        if (job.astria_model_id) {
            await supabaseAdmin!
                .from('job_models')
                .insert({
                    job_id: jobId,
                    version: job.active_model_version,
                    status: 'archived',
                    lora_url: job.download_url // Assuming current url is here
                });
        }

        // - Update Job: Increment version, set status to PAID (ready for upload), mark redo used
        const nextVersion = (job.active_model_version || 1) + 1;

        const { error: updateError } = await supabaseAdmin!
            .from('jobs')
            .update({
                status: 'redo_uploading', // Explicit status instead of reusing 'paid'
                redo_available: false,
                redo_used_at: new Date().toISOString(),
                active_model_version: nextVersion,
                astria_model_id: null,
                download_url: null
            })
            .eq('id', jobId)
            .in('status', ['training_completed', 'completed', 'done', 'failed']); // Concurrency Guard: Only allow from stable states

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, nextVersion });

    } catch (err: any) {
        console.error('Redo Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
