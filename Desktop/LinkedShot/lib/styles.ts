
const STRONG_NEGATIVE_PROMPT = "no text, no watermark, no logo, no signature, no makeup, no plastic skin, no smooth skin, no airbrushed skin, no shiny skin, no distorted face, no asymmetrical face, no extra limbs, no extra fingers, bad anatomy, bad hands, missing fingers, extra fingers, 6 fingers, mutation, deformed, blurry, bad quality, low quality, artifacts, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra limbs, disfigured, malformed limbs, gross proportions, long neck";

export const STYLES = [
    {
        id: "studio_grey",
        name: "Classic Studio (Grey)",
        icon: "🏢",
        prompt: "professional studio headshot of [TRIGGER], light gray seamless background, softbox lighting, subtle rim light, business attire, confident and approachable, high-end corporate portrait, sharp eyes, 85mm lens, shallow depth of field, clear focus, high detail",
        category: "Studio",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "studio_white",
        name: "Clean White",
        icon: "⚪",
        prompt: "professional headshot of [TRIGGER] on pure white background, soft even lighting, minimal shadows, business casual blazer, clean modern corporate photo, sharp focus on eyes, realistic skin texture, high detail",
        category: "Studio",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "executive_dark",
        name: "Executive Dark",
        icon: "💼",
        prompt: "executive headshot of [TRIGGER], dark charcoal background, dramatic but flattering lighting, black suit, luxury corporate portrait, serious expression with slight smile, ultra realistic, high detail, 85mm lens",
        category: "Premium",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "executive_view",
        name: "Executive View",
        icon: "🌇",
        prompt: "executive headshot of [TRIGGER] in a high-rise office, large window background, city view bokeh, natural window light mixing with soft studio light, premium corporate portrait, sharp eyes, photorealistic, luxurious atmosphere",
        category: "Premium",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "modern_office",
        name: "Modern Office",
        icon: "🏙️",
        prompt: "modern office headshot of [TRIGGER], natural window light, blurred office background bokeh, smart casual blazer, relaxed confident posture, premium corporate photography, sharp eyes, photorealistic",
        category: "Office",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "tech_founder",
        name: "Tech Founder",
        icon: "🚀",
        prompt: "founder headshot of [TRIGGER], outdoor city background bokeh, natural daylight, smart casual, confident and authentic, slightly cinematic contrast but photorealistic, sharp eyes, 85mm lens",
        category: "Outdoor",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "building_hallway",
        name: "Corporate Hallway",
        icon: "🏢",
        prompt: "corporate headshot of [TRIGGER] in a modern building hallway, neutral tones, soft natural light, blurred background, business attire, approachable and trustworthy, photorealistic, sharp focus",
        category: "Office",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "warm_library",
        name: "Warm Library",
        icon: "📚",
        prompt: "professional headshot of [TRIGGER] in a warm office with bookshelf background bokeh, soft warm lighting, business casual, calm confident expression, premium portrait photography, realistic skin texture",
        category: "Office",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "corporate_blue",
        name: "Corporate Blue",
        icon: "🟦",
        prompt: "professional studio headshot of [TRIGGER], solid corporate blue background, softbox lighting, business attire, friendly confident expression, centered, sharp focus on eyes, high detail, 85mm lens",
        category: "Studio",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "pastel_modern",
        name: "Modern Pastel",
        icon: "🎨",
        prompt: "modern professional headshot of [TRIGGER], clean pastel background, soft natural light, smart casual, friendly, modern tech vibe, photorealistic, sharp eyes, high detail",
        category: "Creative",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "consultant_neutral",
        name: "Consultant Neutral",
        icon: "🤝",
        prompt: "professional consultant headshot of [TRIGGER], neutral gray background, soft flattering light, subtle smile, crisp shirt and blazer, premium corporate photography, realistic skin texture, sharp focus",
        category: "Professional",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "sales_energetic",
        name: "Energetic Sales",
        icon: "⚡",
        prompt: "upbeat professional headshot of [TRIGGER], bright clean background, confident smile, open posture, smart casual blazer, energetic and friendly, high-end corporate portrait, sharp eyes, photorealistic",
        category: "Professional",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    },
    {
        id: "finance_serious",
        name: "Finance & Law",
        icon: "⚖️",
        prompt: "conservative executive headshot of [TRIGGER], dark suit, minimal expression, clean studio background, high-end corporate lighting, very sharp, realistic skin texture, premium portrait, 85mm lens",
        category: "Professional",
        negative_prompt: STRONG_NEGATIVE_PROMPT
    }
];

export const getStyleById = (id: string) => STYLES.find(s => s.id === id);
