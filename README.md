# Vickky — AI-Powered Discord Assistant

Vickky is a Discord bot that combines everyday utility commands with AI-powered features like conversational chat, translation, and summarization. Built with `discord.js` and Google's Gemini API, it uses a dynamic command-loading architecture so new commands can be added without touching the bot's core logic.

## Features

### AI-Powered Commands
- **`/ask <question>`** — Chat with an AI assistant that remembers conversation context per user, so follow-up questions make sense without repeating yourself.
- **`/translate <text> <language>`** — Translate any text into a language of your choice using AI.
- **`/summarize <text>`** — Get a concise, AI-generated summary of any block of text.

### Utility Commands
- **`/ping`** — Basic health check, replies with "Pong!!!"
- **`/help`** — Dynamically lists every command currently loaded by the bot.
- **`/userinfo`** — Shows info about the user who ran the command (username, display name, server join date).
- **`/serverinfo`** — Shows info about the current server (name, member count, ID).
- **`/avatar [user]`** — Displays a user's avatar in a clean embed. Defaults to your own avatar if no user is specified.
- **`/weather <city>`** — Fetches real-time weather data for any city using the OpenWeatherMap API.

### Community Features
- Automatically sends a one-time welcome message to new users the first time they post in the server.

## Tech Stack

- **Node.js** with ES Modules
- **discord.js v14** — Discord API wrapper
- **Google Gemini API** (`@google/genai`) — AI text generation
- **OpenWeatherMap API** — Weather data
- **dotenv** — Environment variable management

## Architecture Highlights

- **Dynamic command loading** — Commands live as individual files in the `Commands/` folder. The bot reads this folder at startup, imports each file, and registers it automatically — no hardcoded command lists or long `if/else` chains.
- **Single dispatcher pattern** — One `interactionCreate` listener looks up the requested command by name and delegates execution, rather than every command attaching its own listener.
- **Per-user conversation memory** — `/ask` stores each user's recent message history in memory (trimmed to the last few exchanges) so the AI has context for follow-up questions.
- **Deferred replies** — AI commands use `deferReply()`/`editReply()` to stay within Discord's interaction time limits, even when the AI takes a few seconds to respond.
- **Graceful error handling** — API failures (rate limits, timeouts, invalid input) reply with a friendly message instead of crashing the bot.

## Setup

### Prerequisites
- Node.js installed
- A Discord bot application (create one at the [Discord Developer Portal](https://discord.com/developers/applications))
- A free [Google Gemini API key](https://aistudio.google.com)
- A free [OpenWeatherMap API key](https://openweathermap.org)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/0xPrakhar/vickky-the-Ai-bot.git
   cd vickky-the-Ai-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_application_id
   AI_API_KEY=your_gemini_api_key
   WEATHER_API_KEY=your_openweathermap_api_key
   ```

4. Register slash commands with Discord:
   ```
   node deploy-commands.js
   ```

5. Start the bot:
   ```
   node Sever.js
   ```

## Project Structure

```
Dis_Bot/
├── Commands/              # Each slash command lives in its own file
│   ├── ping.js
│   ├── help.js
│   ├── userinfo.js
│   ├── serverinfo.js
│   ├── avatar.js
│   ├── weather.js
│   ├── ask.js
│   ├── translate.js
│   └── summarize.js
├── Sever.js                # Main bot file — loads commands, handles events
├── deploy-commands.js       # Registers slash commands with Discord
├── .env                     # API keys and secrets (not committed)
└── README.md
```

## Adding a New Command

Thanks to the dynamic loader, adding a command doesn't require touching `Sever.js` at all:

1. Create a new file in `Commands/`
2. Export a `commands` object with the command's `name`, `description`, and `options`
3. Export an `execute(interaction)` function with the command's behavior
4. Run `node deploy-commands.js` to register it with Discord
5. Restart the bot

## Known Limitations

- Conversation history and the "greeted users" list are stored in memory and reset when the bot restarts. A persistent database (e.g., MongoDB) is planned for a future update.
- The bot must be manually restarted after adding new command files, and `deploy-commands.js` must be re-run whenever a command's data changes.

## Roadmap

- [ ] Persistent storage (MongoDB) for conversation history and user data
- [ ] Message moderation commands (`/clear`, auto-moderation)
- [ ] CI/CD pipeline for automatic deployment on push

## License

This project is open source and available for learning purposes.
