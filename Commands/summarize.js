import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

export const commands = {
  name: "summarize",
  description: "Summarize a piece of text",
  options: [
    {
      name: "text",
      description: "The text to summarize",
      type: 3, // STRING type
      required: true
    }
  ]
};

export const execute = async (interaction) => {
  try {
    const text = interaction.options.getString("text");

    const prompt = `Summarize the following text in 2-3 concise sentences. Only return the summary, nothing else: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt
    });

    await interaction.reply(response.text);

  } catch (error) {
    await interaction.reply("Sorry, something went wrong while talking to the AI. Please try again in a moment.");
    console.error("Error calling Gemini API:", error);
  }
};