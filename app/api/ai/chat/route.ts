import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OpenRouter not configured' }, { status: 503 });
  }

  try {
    const { message } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "Aura Home",
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: `You are Aura, a world-class interior design consultant. 
            You help users refine their "reimagined" spaces. 
            When a user asks for updates (e.g., "make the rug blue"), you should:
            1. Confirm the design direction.
            2. Provide helpful interior design advice.
            3. Recommend "shoppable" items. Format shoppable items as follows:
               [ITEM: Name | Price | Description | ImageSeed]
            Keep your tone sophisticated, encouraging, and professional.`
          },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      text: data.choices[0].message.content
    });
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
