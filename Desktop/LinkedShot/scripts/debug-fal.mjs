
import fal from '@fal-ai/serverless-client';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });

const TRAIN_MODEL = 'fal-ai/flux-lora-fast-training';

async function testFal() {
    console.log('Testing Fal Connection...');
    const key = process.env.FAL_KEY;
    if (!key) {
        console.error('Error: FAL_KEY not found in .env.local');
        return;
    }

    fal.config({ credentials: key });

    // Use a known public valid zip or just a dummy URL to check validation
    // This is a small zip with images often used for testing or just Google logo to see if it accepts the URL
    // Actually, let's use a dummy URL that definitely exists but might fail processing, 
    // to see if we pass the "Bad Request" verification stage.
    const dummyZipUrl = 'https://github.com/flatents/stablediffusion-lora-training-colab/raw/main/test_images.zip'; // hypothetical valid zip

    console.log(`Submitting to ${TRAIN_MODEL} with dummy URL...`);

    try {
        const result = await fal.queue.submit(TRAIN_MODEL, {
            input: {
                images_data_url: dummyZipUrl,
                trigger_word: 'test_dog',
                is_style: false
            },
            webhookUrl: undefined // No webhook for simple test
        });
        console.log('Success! Request ID:', result.request_id);
    } catch (error) {
        console.error('Fal Error:', error);
        if (error.body) {
            console.error('Error Body:', JSON.stringify(error.body, null, 2));
        }
    }
}

testFal();
