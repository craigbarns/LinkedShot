
import fal from '@fal-ai/serverless-client';

const FAL_KEY = process.env.FAL_KEY;
if (FAL_KEY) {
    fal.config({ credentials: FAL_KEY });
} else {
    console.warn('FAL_KEY is not set in environment variables');
}

// Using FLUX Lora training (fast and good quality)
const TRAIN_MODEL = 'fal-ai/flux-lora-fast-training';
const INFERENCE_MODEL = 'fal-ai/flux-lora';

export async function startFalTraining(zipUrl: string, triggerWord: string) {
    if (!zipUrl) throw new Error('Zip URL is required for Fal training');
    if (!process.env.FAL_KEY) throw new Error('FAL_KEY is misssing');

    console.log('[Fal Lib] Submitting to', TRAIN_MODEL);
    console.log('[Fal Lib] Input:', {
        images_data_url: zipUrl,
        trigger_word: triggerWord
    });

    // Using fal-ai/flux-lora-fast-training
    // Input must be `images_data_url` pointing to a ZIP file
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const webhookUrl = (appUrl && !appUrl.includes('localhost'))
        ? `${appUrl}/api/webhooks/fal`
        : undefined;

    console.log('[Fal Lib] Webhook URL:', webhookUrl); // Debug log

    try {
        const result = await fal.queue.submit(TRAIN_MODEL, {
            input: {
                images_data_url: zipUrl,
                trigger_word: triggerWord,
                is_style: false
            },
            webhookUrl: webhookUrl,
        });
        return result;
    } catch (error: any) {
        console.error('[Fal Lib] Submit Error:', error);
        // Fal client errors often have detailed body in .body or .message
        if (error.body) console.error('[Fal Lib] Error Body:', error.body);
        throw error;
    }
}

export async function checkFalStatus(requestId: string) {
    return await fal.queue.status(TRAIN_MODEL, {
        requestId,
        logs: true
    });
}

export async function getFalResult(requestId: string) {
    return await fal.queue.result(TRAIN_MODEL, {
        requestId
    });
}

// Placeholder for future implementation
export async function generateImage(modelUrl: string, prompt: string) {
    console.log('Generating with:', modelUrl, prompt);
    // TODO: Implement inference
    return Promise.resolve({ success: true, message: 'Not implemented' });
}
