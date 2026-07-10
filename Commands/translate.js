import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// Initialize the client. It automatically picks up the process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
export const commands = {
  name: "translate",
  description: "translate into any language",
  options: [
    {
      name: "text",
      description: "What you want to tranlate",
      type: 3, // STRING type
      required: true
    },
     {
      name: "language",
      description: "in which language you want to tranlate",
      type: 3, // STRING type
      required: true
    }
  ]
};

export const execute = async(interaction)=>{
try {
    const text=interaction.options.getString("text") 
    const language=interaction.options.getString("language") 
    const prompt = `Translate the following text into ${language}. Only return the translated text, nothing else: "${text}"`
     const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',// Use the latest flash or pro model
      contents:prompt
     })
     await interaction.reply(response.text)

} catch (error) {
    await interaction.reply("Sorry, something went wrong while talking to the AI. Please try again in a moment.");
     console.error("Error calling Gemini API:", error);
}

}