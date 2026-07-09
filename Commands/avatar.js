// Import the EmbedBuilder class from discord.js
// This lets us create fancy embedded messages with colors, images, titles, etc.
import { EmbedBuilder } from 'discord.js';

// Define the command details (name and description)
// This is what Discord will show when someone types /avatar
export const commands = {
  name: "avatar",              // The command name: /avatar
  description: "show the avatar image" // What the command does
};

// The function that runs when someone uses the command
export const execute = (interaction) => {
  // Get the user's avatar URL (the link to their profile picture)
  const avatarUrl = interaction.user.displayAvatarURL();

  // Get the user's username (their Discord name)
  const username = interaction.user.username;

  // Create a new embed message
  const myEmbed = new EmbedBuilder()
    .setTitle(`${username}'s Avatar`) // Title of the embed
    .setImage(avatarUrl)              // Show the avatar image
    .setColor("#0099ff");             // Set a nice blue color

  // Send the embed back as a reply to the user
  interaction.reply({ embeds: [myEmbed] });
};
