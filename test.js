import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

console.log("Starting script...");
   console.log("API Key loaded:", process.env.AI_API_KEY ? "Yes" : "NO KEY FOUND");
// Initialize the client. It automatically picks up the process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

async function generateText() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',// Use the latest flash or pro model
      contents: 'Explain the concept of quantum computing in one sentence.',
    });

    console.log("Response:", response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}
console.log("Calling generateText...");
generateText();
