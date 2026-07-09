export const commands = {
  name: "help",
  description: "Lists all available commands"
};

export const execute = (interaction) => {
  let replyText = "**Available Commands**\n\n";

  // Loop directly over the Map — no need to convert to an array first
  for (const [name, item] of interaction.client.commands) {
    replyText += `/${item.data.name} — ${item.data.description}\n`;
  }

  interaction.reply(replyText);
};