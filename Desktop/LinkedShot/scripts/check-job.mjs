
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkJob(id) {
    const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- JOB STATUS ---');
    console.log('ID:', job.id);
    console.log('Status:', job.status);
    console.log('Fal Request ID:', job.astria_model_id);
    console.log('Trigger Word:', job.astria_prompt_id);
    console.log('Download URL (LoRA):', job.download_url);
    console.log('Result Images:', job.result_images);

    // If status is completed but URL is missing, it's a problem
    if (job.status === 'training_completed' && !job.download_url) {
        console.error('CRITICAL: Job is marked completed but LoRA URL is missing!');
        // We need to fetch it from Fal
    }
}

const jobId = process.argv[2];
if (!jobId) {
    console.error('Usage: node scripts/check-job.mjs <jobId>');
} else {
    checkJob(jobId);
}
