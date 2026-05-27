require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is alive."),
  new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello to the bot."),
  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Show information about you."),
  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Show information about this server."),
  new SlashCommandBuilder()
    .setName("catfact")
    .setDescription("Get a random cat fact."),
  new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Get a random joke.")
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Refreshing ${commands.length} slash commands...`);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands were registered successfully.");
  } catch (error) {
    console.error(error);
  }
})();