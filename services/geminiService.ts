
import { GoogleGenAI } from "@google/genai";

export const getBitChatResponse = async (
  userMessage: string, 
  attachedImage?: { data: string, mimeType: string }
): Promise<{ text: string, image?: string, sources?: any[] }> => {
  const imageKeywords = ['image', 'generate', 'draw', 'picture', 'photo', 'ছবি', 'তৈরি করো', 'আঁকো'];
  const isImageRequest = imageKeywords.some(kw => userMessage.toLowerCase().includes(kw)) || attachedImage;
  
  // Use Flash models by default to avoid triggering mandatory paid key requirements 
  // until a permission error actually occurs.
  const modelName = isImageRequest ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';
  
  // We check for search keywords but use the Flash model which supports search grounding.
  const searchKeywords = ['search', 'news', 'latest', 'খবর', 'খুঁজো', 'সার্চ'];
  const needsSearch = !isImageRequest && searchKeywords.some(kw => userMessage.toLowerCase().includes(kw));

  // Create a new instance right before call to ensure we use the most up-to-date key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  try {
    if (attachedImage) {
      // Image editing/transformation
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: attachedImage.data.split(',')[1], mimeType: attachedImage.mimeType } },
            { text: userMessage || "এই ছবিটি আপনার প্রম্পট অনুযায়ী পরিবর্তন করুন।" }
          ]
        },
        config: {
          systemInstruction: "You are an expert image editor. Transform the provided image according to the user's instructions. Speak in Bengali (বাংলা)."
        }
      });

      let generatedImage = "";
      let responseText = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          responseText = part.text;
        }
      }
      return { text: responseText || "আপনার অনুরোধ অনুযায়ী ছবিটি এডিট করা হয়েছে।", image: generatedImage };
    }

    if (isImageRequest) {
      // Text-to-Image Generation
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: userMessage }] },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        },
      });

      let generatedImage = "";
      let responseText = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          generatedImage = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          responseText = part.text;
        }
      }
      return { text: responseText || "আপনার জন্য একটি ছবি তৈরি করা হয়েছে।", image: generatedImage };
    }

    // Standard Chat or Grounded Chat with gemini-3-flash-preview
    const config: any = {
      systemInstruction: "You are 'Bit chat i', a professional and friendly AI assistant. You MUST speak in Bengali (বাংলা) by default. Use Google Search grounding when asked for facts or recent info.",
    };

    if (needsSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userMessage,
      config,
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { text: response.text || "আমি আপনার কথা বুঝতে পেরেছি।", sources };
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    
    const errorMessage = error?.message || "";
    // Check for 403 PERMISSION_DENIED or Requested entity was not found.
    // ONLY trigger the paid key selection dialog if the request actually fails.
    if (errorMessage.includes("PERMISSION_DENIED") || 
        errorMessage.includes("403") || 
        errorMessage.includes("Requested entity was not found")) {
      
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        // Trigger the key selection dialog provided by the platform.
        await (window as any).aistudio.openSelectKey();
        return { text: "ছবি তৈরি বা সার্চের জন্য পারমিশন প্রয়োজন। আমি একটি ডায়ালগ বক্স ওপেন করেছি, দয়া করে আপনার একটি পেইড প্রজেক্টের (Paid Project) API কী নির্বাচন করুন এবং আবার চেষ্টা করুন।" };
      }
    }
    
    return { text: "দুঃখিত, আমি আপনার অনুরোধটি প্রসেস করতে পারছি না। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
  }
};

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const base64Data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/png';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from API");
  } catch (error: any) {
    console.error("Gemini Image Editing Error:", error);
    const errorMessage = error?.message || "";
    if (errorMessage.includes("403") || errorMessage.includes("PERMISSION_DENIED") || errorMessage.includes("Requested entity was not found")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
        }
    }
    throw error;
  }
};
