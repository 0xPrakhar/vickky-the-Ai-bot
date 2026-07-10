import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// Initialize the client. It automatically picks up the process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
const conversationHistory= new Map()
export const commands = {
  name: "ask",
  description: "Ask the AI anything ",
  options: [
    {
      name: "question",
      description: "What you want to ask",
      type: 3, // STRING type
      required: true
    }
  ]
};

export const execute = async(interaction)=>{
try {
  await interaction.deferReply();
 const userId = interaction.user.id
 const userHistory = conversationHistory.get(userId)|| [];
 const question=interaction.options.getString("question") 
 const fullconverstaion = [...userHistory, {role:"user", parts:[{text:question}]}];
     const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',// Use the latest flash or pro model
      contents: fullconverstaion
     })
    //  await interaction.reply(response.text)
    await interaction.editReply(response.text);
     const finalConversation =[...fullconverstaion,{role:"model", parts:[{text:response.text}]}]
    const trimedresposne= finalConversation.slice(-6)
    conversationHistory.set(userId,trimedresposne)
} catch (error) {
    await interaction.reply("Sorry, something went wrong while talking to the AI. Please try again in a moment.");
     console.error("Error calling Gemini API:", error);
}

}