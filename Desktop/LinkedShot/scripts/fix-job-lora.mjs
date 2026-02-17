
import fal from '@fal-ai/serverless-client';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

fal.config({ credentials: process.env.FAL_KEY });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixJob(requestId, jobId) {
    if (!requestId || !jobId) {
        console.error('Usage: node scripts/fix-job-lora.mjs <requestId> <jobId>');
        process.exit(1);
    }

    console.log(`Checking Fal result for Request: ${requestId}`);

    try {
        const result = await fal.queue.result('fal-ai/flux-lora-fast-training', {
            requestId
        });

        console.log('Fal Result:', JSON.stringify(result, null, 2));

        // Extract Lora URL
        // Usually it's diffusers_lora_file.url or similar
        let loraUrl = null;
        if (result.diffusers_lora_file && result.diffusers_lora_file.url) {
            loraUrl = result.diffusers_lora_file.url;
        } else {
            console.error('Could not find diffusers_lora_file.url in result');
            return;
        }

        console.log(`Found LoRA URL: ${loraUrl}`);

        // Update DB
        const { error } = await supabase
            .from('jobs')
            .update({
                download_url: loraUrl,
                status: 'completed',
                updated_at: new Date().toISOString()
            })
            .eq('id', jobId);

        if (error) {
            console.error('Supabase Update Error:', error);
        } else {
            console.log('✅ Job updated successfully! You can now generate images.');
        }

    } catch (err) {
        console.error('Fal Error:', err);
        if (err.body) console.error('Body:', err.body);
    }
}

const reqId = process.argv[2];
const jId = process.argv[3];

fixJob(reqId, jId);
