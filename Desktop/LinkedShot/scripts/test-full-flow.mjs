
import { createClient } from '@supabase/supabase-js';
import fal from '@fal-ai/serverless-client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const falKey = process.env.FAL_KEY;

if (!supabaseUrl || !serviceRoleKey || !falKey) {
    console.error('Missing env vars:', { supabaseUrl, serviceRoleKey: !!serviceRoleKey, falKey: !!falKey });
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
fal.config({ credentials: falKey });

async function runTest() {
    console.log('--- STARTING INTEGRATION DIAGNOSTICS ---');

    // 1. Create a dummy zip file
    console.log('1. Creating dummy zip...');
    const dummyZipPath = 'dummy_test.zip';
    fs.writeFileSync(dummyZipPath, 'PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00\x00\x00'); // Valid empty zip header
    const zipBuffer = fs.readFileSync(dummyZipPath);

    // 2. Upload to Supabase
    const fileName = `test_job_${Date.now()}/training_data.zip`;
    console.log(`2. Uploading to Supabase: ${fileName}`);

    const { error: uploadError } = await supabase.storage
        .from('training-images')
        .upload(fileName, zipBuffer, { contentType: 'application/zip', upsert: true });

    if (uploadError) {
        console.error('Supabase Upload Error:', uploadError);
        return;
    }
    console.log('Upload successful.');

    // 3. Generate Signed URL
    console.log('3. Generating Signed URL...');
    const { data: signedData, error: signedError } = await supabase.storage
        .from('training-images')
        .createSignedUrl(fileName, 3600);

    if (signedError) {
        console.error('Signed URL Error:', signedError);
        return;
    }
    const signedUrl = signedData.signedUrl;
    console.log('Signed URL:', signedUrl);

    // 4. Test Connectivity to Signed URL
    console.log('4. verifying Signed URL accessibility...');
    try {
        const resp = await fetch(signedUrl);
        console.log('Fetch Status:', resp.status, resp.statusText);
        if (!resp.ok) {
            console.error('Failed to fetch the Signed URL. This is likely the issue.');
            const text = await resp.text();
            console.error('Response:', text);
        }
    } catch (e) {
        console.error('Fetch Check Error:', e);
    }

    // 5. Submit to Fal
    console.log('5. Submitting to Fal...');
    try {
        const result = await fal.queue.submit('fal-ai/flux-lora-fast-training', {
            input: {
                images_data_url: signedUrl,
                trigger_word: 'test_dog',
                is_style: false
            },
            webhookUrl: undefined
        });
        console.log('✅ FAL SUCCESS! Request ID:', result.request_id);
    } catch (falError) {
        console.error('❌ FAL FAILURE:', falError);
        if (falError.body) {
            console.error('Error Body:', falError.body);
        }
    }

    // Cleanup
    fs.unlinkSync(dummyZipPath);
}

runTest();
