'use client';

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! 
});

export const MODELS = {
  GENERAL: 'gemini-3-flash-preview',
  COMPLEX: 'gemini-3.1-pro-preview',
  IMAGE: 'gemini-2.5-flash-image'
};

export async function reimaginedRoom(originalImageBase64: string, style: string, refinement?: string) {
  // We use the image model to reimagined the space
  const prompt = refinement 
    ? `Reimagine this room in ${style} style. Additionally, apply these refinements: ${refinement}. High quality, photorealistic, interior design photography.`
    : `Reimagine this room as a high-end interior design project in ${style} style. Maintain the basic structural layout but completely transform the furniture, decor, color palette, and lighting to match ${style}. Photorealistic, 4k.`;

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
            aspectRatio: "3:4", // Good for vertical room shots
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
