
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkFalStatus, getFalResult } from '@/lib/fal';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return NextResponse.json({ error: 'Missing Job ID' }, { status: 400 });
    }

    // 1. Fetch Job
    let { data: job, error } = await supabaseAdmin!
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

    if (error || !job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // 2. Sync Status if 'training' OR if 'completed' but missing URL
    const isTraining = job.status === 'training' || job.status === 'processing';
    const isMissingUrl = (job.status === 'completed' || job.status === 'training_completed') && !job.download_url;

    if ((isTraining || isMissingUrl) && job.astria_model_id) {
        try {
            // If already completed but missing URL, we can skip status check and go straight to result if we wanted,
            // but checking status first is safer to confirm it's really done.
            const statusRes = await checkFalStatus(job.astria_model_id);
            console.log('[Status API] Fal Status:', statusRes.status);

            if (statusRes.status === 'COMPLETED' || (statusRes.status as string) === 'OK') { // Check for OK/COMPLETED
                // Fetch result to get LoRA URL
                const result = await getFalResult(job.astria_model_id) as any;

                let loraUrl: string | undefined;
                // Inspect result structure (it changes sometimes)
                if (result.diffusers_lora_file?.url) {
                    loraUrl = result.diffusers_lora_file.url;
                }

                if (loraUrl) {
                    const updateData: any = {
                        status: 'completed', // Use standard 'completed'
                        download_url: loraUrl,
                        updated_at: new Date().toISOString()
                    };

                    await supabaseAdmin!
                        .from('jobs')
                        .update(updateData)
                        .eq('id', jobId);

                    job.status = 'completed';
                    job.download_url = loraUrl;
                }
            } else if ((statusRes.status as string) === 'FAILED' || (statusRes.status as string) === 'ERROR') {
                await supabaseAdmin!
                    .from('jobs')
                    .update({ status: 'failed' })
                    .eq('id', jobId);
                job.status = 'failed';
            }
        } catch (err) {
            console.error('Failed to sync Fal status:', err);
        }
    }

    return NextResponse.json({ job });
}
