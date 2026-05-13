import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function restructureRequest(requestText: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Restructure the following request from "The Architect" to "The Builder".
  Provide two versions:
  1. Non-technical: A clear summary of WHAT is requested (max 250 characters).
  2. Technical: A clear summary of HOW to implement it technically (max 250 characters).
  
  User Request: "${requestText}"`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nonTech: { type: Type.STRING, description: "Non-technical description" },
            tech: { type: Type.STRING, description: "Technical description" }
          },
          required: ["nonTech", "tech"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      nonTechDescription: result.nonTech?.slice(0, 250) || "",
      techDescription: result.tech?.slice(0, 250) || ""
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      nonTechDescription: "Error processing request.",
      techDescription: "Error processing request."
    };
  }
}
