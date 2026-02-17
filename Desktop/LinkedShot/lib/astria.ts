
const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const ASTRIA_DOMAIN = process.env.ASTRIA_DOMAIN || 'api.astria.ai';

if (!ASTRIA_API_KEY) {
    console.warn('ASTRIA_API_KEY is not set');
}

export async function createTune(
    jobId: string,
    title: string,
    name: string,
    imageUrls: string[],
    baseType: 'sdxl15' | 'flux1dev' = 'flux1dev' // Flux is standard now for quality
) {
    // Astria expects a specific format. Check docs for latest.
    // Assuming minimal tuned model creation endpoint.

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://bark-studio.vercel.app'}/api/webhooks/astria`;

    const response = await fetch(`https://${ASTRIA_DOMAIN}/tunes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ASTRIA_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tune: {
                title: title,
                name: name, // The trigger word (e.g. "ohwx dog")
                base_tune_id: 690204, // Flux1.dev base tune ID (check documentation/dashboard for correct ID)
                image_urls: imageUrls,
                callback: webhookUrl,
                prompts_attributes: [
                    { text: `a photo of ${name} dog in space suit, 8k`, callback: webhookUrl }, // Example initial prompt
                ]
            }
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Astria API Error: ${error}`);
    }

    return response.json();
}
