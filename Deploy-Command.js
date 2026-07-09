// Import REST and Routes from discord.js
import { REST, Routes } from 'discord.js';
import 'dotenv/config';

// Create a new REST instance with API version 10
// IMPORTANT: Never expose your bot token publicly. Use environment variables instead.
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    // Correct method: use applicationCommands (plural), not applicationCommand
    // You need your CLIENT_ID (bot's application ID) here
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // Replace with your actual CLIENT_ID
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
