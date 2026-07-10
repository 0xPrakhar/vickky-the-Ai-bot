import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import fs from 'fs/promises';

const commandsPath = './Commands';

(async () => {
  try {
    console.log("Reading command files...");

    const files = await fs.readdir(commandsPath);
    const jsfiles = files.filter(f => f.split('.').pop() === 'js');

    const commandsArray = [];

    for (const file of jsfiles) {
      const fullPath = commandsPath + '/' + file;
      const commandModule = await import(fullPath);
      const commandData = commandModule.commands;

      if (commandData) {
        commandsArray.push(commandData);
      } else {
        console.log(`Skipping empty file: ${file}`);
      }
    }

    console.log(`Found ${commandsArray.length} commands to register:`, commandsArray.map(c => c.name));

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsArray }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();