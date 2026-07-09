export const commands = 
  {
    name: "ping",
    description: "Replies with pong!"
  }
;

 export const execute = (interaction) => {

    interaction.reply("Pong!!!");
  };
