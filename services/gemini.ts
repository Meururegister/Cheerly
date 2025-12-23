
import { GoogleGenAI } from "@google/genai";

export const enhanceBio = async (name: string, title: string, roughBio: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    I am building a personal portfolio website. 
    Name: ${name}
    Current Title: ${title}
    Draft Bio: ${roughBio}
    
    Please rewrite this bio to be professional, engaging, and concise (max 3 sentences). 
    Make it suitable for a developer portfolio or personal website.
    Respond with ONLY the polished text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || roughBio;
  } catch (error) {
    console.error("AI Enhancement failed:", error);
    return roughBio;
  }
};

export const generateProjectDescription = async (projectName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Suggest a one-sentence professional description for a software project named "${projectName}". 
    Make it sound modern and impactful.
    Respond with ONLY the polished text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "A cool project building awesome things.";
  } catch (error) {
    console.error("AI project description failed:", error);
    return "A project focusing on performance and quality.";
  }
};
