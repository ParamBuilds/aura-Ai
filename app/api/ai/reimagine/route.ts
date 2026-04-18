import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const OPENROUTER_MODELS = {
  VISION: 'google/gemini-pro-1.5',
  IMAGE: 'openai/dall-e-3'
};

async function openRouterRequest(model: string, messages: any[]) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "X-Title": "Aura Home",
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter Error: ${errorData.error?.message || response.statusText}`);
  }

  return await response.json();
}

export async function POST(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OpenRouter not configured' }, { status: 503 });
  }

  try {
    const { originalImageBase64, style, refinement } = await req.json();

    // Step 1: Vision - Describe the room and transform plan
    const visionPrompt = `Look at this room. Describe its architecture and furniture layout in detail. 
    Then, explain exactly how to transform it into a ${style} style interior. 
    Keep the description concise and focused on visual details for an image generator.
    ${refinement ? `Also incorporate these refinements: ${refinement}` : ''}`;

    const visionResponse = await openRouterRequest(OPENROUTER_MODELS.VISION, [
      {
        role: "user",
        content: [
          { type: "text", text: visionPrompt },
          { 
            type: "image_url", 
            image_url: { url: `data:image/jpeg;base64,${originalImageBase64}` } 
          }
        ]
      }
    ]);

    const designPlan = visionResponse.choices[0].message.content;

    // Step 2: Image Generation - Use DALL-E 3 with the plan
    const imagePrompt = `A high-end interior design photograph of a room based on this plan: ${designPlan}. 
    Style: ${style}. Photorealistic, 8k resolution, architectural digest style, professional lighting.`;

    const imageResponse = await openRouterRequest(OPENROUTER_MODELS.IMAGE, [
      {
        role: "user",
        content: imagePrompt
      }
    ]);

    const content = imageResponse.choices[0].message.content;
    const imageUrlMatch = content.match(/https?:\/\/\S+/);
    const imageUrl = imageUrlMatch ? imageUrlMatch[0].replace(/[()]/g, '') : null;

    return NextResponse.json({
      image: imageUrl,
      description: designPlan
    });
  } catch (error: any) {
    console.error("API Reimagine Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
