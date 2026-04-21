'use client';

import { GoogleGenAI } from "@google/genai";

let geminiAiInstance: any = null;

function getGeminiAi() {
  if (!geminiAiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined. Please set it in your environment variables.");
    }
    geminiAiInstance = new GoogleGenAI({ apiKey });
  }
  return geminiAiInstance;
}

const ENABLE_OPENROUTER = process.env.NEXT_PUBLIC_ENABLE_OPENROUTER === 'true';

export const MODELS = {
  GENERAL: 'gemini-3-flash-preview',
  COMPLEX: 'gemini-3.1-pro-preview',
  IMAGE: 'gemini-2.5-flash-image'
};

export async function reimaginedRoom(originalImageBase64: string, style: string, refinement?: string) {
  // If OpenRouter is enabled, use the server-side proxy
  if (ENABLE_OPENROUTER) {
    try {
      const response = await fetch('/api/ai/reimagine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalImageBase64,
          style,
          refinement,
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      
      const errorData = await response.json();
      console.warn("OpenRouter API failed, falling back to Gemini:", errorData.error);
    } catch (error) {
      console.error("OpenRouter request failed, falling back to Gemini:", error);
    }
  }

  // Gemini Implementation (Existing Client-Side)
  const prompt = refinement 
    ? `Reimagine this room in ${style} style. Additionally, apply these refinements: ${refinement}. High quality, photorealistic, interior design photography.`
    : `Reimagine this room as a high-end interior design project in ${style} style. Maintain the basic structural layout but completely transform the furniture, decor, color palette, and lighting to match ${style}. Photorealistic, 4k.`;

  const ai = getGeminiAi();
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE,
    contents: {
      parts: [
        {
          inlineData: {
            data: originalImageBase64,
            mimeType: "image/jpeg"
          }
        },
        { text: prompt }
      ]
    },
    config: {
        imageConfig: {
            aspectRatio: "3:4",
            imageSize: "1K"
        }
    }
  });

  let imageBase64: string | null = null;
  let description = "";

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      imageBase64 = part.inlineData.data;
    } else if (part.text) {
      description += part.text;
    }
  }

  return {
    image: imageBase64 ? `data:image/png;base64,${imageBase64}` : null,
    description
  };
}

export function createDesignChat() {
  if (ENABLE_OPENROUTER) {
    return {
      sendMessage: async ({ message }: { message: string }) => {
        try {
          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          });

          if (response.ok) {
            return await response.json();
          }
          
          const errorData = await response.json();
          throw new Error(errorData.error || 'Chat API failed');
        } catch (error) {
          console.error("OpenRouter Chat failed:", error);
          // Return a fallback message if server fails
          return { text: "I'm having trouble connecting to my creative circuits, but let's keep going. How else can I help?" };
        }
      }
    };
  }

  // Gemini Implementation (Existing Client-Side)
  const ai = getGeminiAi();
  return ai.chats.create({
    model: MODELS.COMPLEX,
    config: {
      systemInstruction: `You are Aura, a world-class interior design consultant. 
      You help users refine their "reimagined" spaces. 
      When a user asks for updates (e.g., "make the rug blue"), you should:
      1. Confirm the design direction.
      2. Provide helpful interior design advice.
      3. Recommend "shoppable" items. Format shoppable items as follows:
         [ITEM: Name | Price | Description | ImageSeed]
         e.g., [ITEM: Navy Blue Wool Rug | $450 | A plush, hand-woven rug with deep navy tones. | navy-rug]
      Keep your tone sophisticated, encouraging, and professional.`,
    }
  });
}
