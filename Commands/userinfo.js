export const commands = 
  {
    name: "userinfo",
    description: "Shows information about the user"
  }
;

 export const execute = (interaction) => {
const username =interaction.user.username;
const joinedDate =interaction.member.joinedTimestamp;
const dateObj = new Date(joinedDate);        // turn timestamp into a real Date object
const dateJoined = dateObj.toLocaleString();  // NOW convert that Date into readable text
const gobalName =interaction.user.globalName;
  interaction.reply(`**User Information**\n\n**Username:** ${username}\n**Display Name:** ${globalName}\n**Joined Server:** ${dateJoined}```);

   
  };
