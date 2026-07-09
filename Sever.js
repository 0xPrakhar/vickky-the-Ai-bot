// Bringing in the tools we need:
// Client = the bot's connection to Discord
// GatewayIntentBits = permissions telling Discord what data our bot is allowed to receive
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs/promises'; // WHY: the Promise-based fs lets us use await, so we can pause and wait for files to load before moving on — needed because import() is also a Promise, and mixing await with old callback-style fs doesn't work cleanly
dotenv.config(); // WHY: loads secrets (token) from .env into process.env, so we never hardcode sensitive stuff in the code itself

const commandsPath = './Commands';

// WHY a Map (not an object or array): we need FAST lookup by command name later.
// Map lets us say "give me whatever is stored under 'ping'" instantly,
// instead of looping through a list every single time a command runs.
// It's declared here, OUTSIDE the try block, so it doesn't get wiped out
// once loading finishes — it needs to stay alive for the whole life of the bot.
const commandCollection = new Map();

try {
  // WHY await here: readdir returns a Promise, we need the actual filenames
  // before we can do anything else, so we pause until it resolves.
  const files = await fs.readdir(commandsPath);

  // WHY filter: the folder might have non-command files later (like a README),
  // so we only try to load files ending in .js
  const jsfiles = files.filter(f => f.split('.').pop() === 'js');

  // WHY loop through each file individually: each file is a separate command,
  // and each needs its own import — we can't import "all files" at once.
  for (const file of jsfiles) {
    // WHY build a full path: import() needs an exact file location,
    // not just a folder — this combines folder + filename into one real path.
    const fullPath = commandsPath + '/' + file;

    // WHY dynamic import() (not a normal static import at the top of the file):
    // we don't know the filenames in advance — they could change any time
    // we add a new command file — so we discover and load them at runtime instead.
    const commandModule = await import(fullPath);

    // Every command file is expected to export two things:
    // 1) "commands" — the name/description info
    // 2) "execute" — the function that runs when someone uses the command
    const commandData = commandModule.commands;

    // WHY this check: some command files are still empty placeholders
    // (no exports yet) — without this check, trying to read .name on
    // "undefined" would crash the whole loading process.
    if (commandData) {
      const commandExecute = commandModule.execute;

      // WHY store BOTH data and execute together, keyed by name:
      // later, when a command runs, we need both pieces —
      // the name confirms what was requested, and execute is what we actually run.
      commandCollection.set(commandData.name, {
        data: commandData,
        execute: commandExecute
      });
    } else {
      // WHY continue (not crash): one broken/empty file shouldn't stop
      // every other valid command from loading successfully.
      console.log(`Skipping empty file: ${file}`);
      continue;
    }
  }

  // Just a helpful log to confirm what actually got loaded successfully
  console.log(`Loaded ${commandCollection.size} commands:`, [...commandCollection.keys()]);

} catch (error) {
  // WHY a top-level catch: if the whole folder read fails (e.g. folder doesn't exist),
  // we want a clear error message instead of the app crashing silently.
  console.error(`Error loading command files: ${error}`);
}


// Creating the actual bot connection.
// WHY these specific intents: Discord requires you to explicitly ask for
// permission to receive certain data — here we're asking for server info,
// messages in servers, and the actual text content of those messages.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Just logs every message's text to your terminal — useful for debugging,
// not seen by Discord users.
client.on('messageCreate', (msg) => {
  console.log(msg.content);
});

// WHY the bot-check: without "if (msg.author.bot) return", the bot could
// end up replying to itself (or other bots) in an infinite loop.
client.on('messageCreate', (msg) => {
 if(msg.author.bot) return;
 
    msg.reply({
    content:"Hello,folks"
  })
});


// THIS is the heart of your dynamic command system.
// WHY only ONE interactionCreate listener: if every command file attached
// its own listener, they'd ALL fire for every single interaction — messy
// and wasteful. Instead, this single listener acts as the "dispatcher" —
// it looks at what command was used, and hands off the work to the right file.
client.on("interactionCreate", async (interaction) => {
    // WHY this check: interactionCreate fires for more than just slash commands
    // (buttons, menus, etc. also count) — we only want to handle slash commands here.
    if (!interaction.isChatInputCommand()) return;

    // WHY interaction.commandName: Discord tells us exactly which command
    // name the user typed — we use that as the "key" to find the matching
    // entry in our Map, instead of hardcoding a big if/else chain per command.
    const command = commandCollection.get(interaction.commandName);

    if(command){
      // WHY pass "interaction" here: the command's execute function needs
      // this object to know WHO ran it, WHAT they typed, and HOW to reply.
      command.execute(interaction)
      console.log(interaction)
    }
    else{
      // WHY this else matters: if Discord somehow has a command registered
      // that isn't in our Map (e.g. we forgot to reload commands), we log it
      // instead of crashing the bot.
      console.log("command was not found")
      return
    }
});

// WHY process.env.DISCORD_TOKEN: keeps the secret token out of the code itself,
// loaded safely from .env instead — so it's never accidentally shared or committed to GitHub.
client.login(process.env.DISCORD_TOKEN);