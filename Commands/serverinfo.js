export const commands = 
  {
    name: "serverinfo",
    description: "Shows information about the server"
  }
;

 export const execute = (interaction) => {
const name =interaction. guild.name;
const memberCount =interaction.guild.memberCount;
const id= interaction.guild.id;
const joinedDate =interaction.guild.joinedTimestamp;
const dateObj = new Date(joinedDate);        // turn timestamp into a real Date object
const dateJoined = dateObj.toLocaleString();  // NOW convert that Date into readable text
  interaction.reply(`**Server Information**\n\n**Server Name:** ${name}\n**Member Count:** ${memberCount}\n**Server ID:** ${id}\n**Bot Joined:** ${dateJoined}`);
   
  };
