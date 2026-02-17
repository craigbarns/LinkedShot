
import fal from '@fal-ai/serverless-client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
fal.config({ credentials: process.env.FAL_KEY });

const LORA_URL = 'https://v3b.fal.media/files/b/0a8e93a8/5eHOfdd9Md0zEYV-Q6ijk_pytorch_lora_weights.safetensors';
const PROMPT = 'dog-125c7d24, as a jedi master';

console.log('Generating with:', { LORA_URL, PROMPT });

async function generate() {
    try {
        const result = await fal.subscribe('fal-ai/flux-lora', {
            input: {
                prompt: PROMPT,
                loras: [{ path: LORA_URL, scale: 1.0 }],
                image_size: "square_hd",
                num_inference_steps: 28,
                guidance_scale: 3.5,
                enable_safety_checker: false
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS') {
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            }
        });

        console.log('--- SUCCESS ---');
        console.log('Result:', result);
        if (result.images && result.images[0]) {
            console.log('IMAGE URL:', result.images[0].url);
        }
    } catch (e) {
        console.error('--- ERROR ---');
        console.error(e);
        if (e.body) console.error(JSON.stringify(e.body, null, 2));
    }
}

generate();
