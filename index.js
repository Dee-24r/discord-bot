require("dotenv").config();
const axios = require("axios");

const { Client, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.username}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "ping") {
        const start = Date.now();
        await interaction.deferReply();
        const replyTime = Date.now() - start;
        const websocketLatency = Math.round(client.ws.ping);

        await interaction.editReply(
            `Pong!\nResponse time: ${replyTime}ms\nWebSocket ping: ${websocketLatency}ms`
        );
        return;
    }

    if (interaction.commandName === "hello") {
        await interaction.reply(`Hello, ${interaction.user.username}!`);
        return;
    }

    if (interaction.commandName === "userinfo") {
        const user = interaction.user;

        await interaction.reply({
          embeds: [
          {
            title: "User Info",
            color: 0x5865f2,
            thumbnail: {
            url: user.displayAvatarURL({ size: 256 })
            },
            fields: [
            { name: "Username", value: user.username, inline: true },
            { name: "User ID", value: user.id, inline: true },
            { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
            {
                name: "Account Created",
                value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
                inline: true
            }
            ]
          }
          ]
        });
        return;
    }

    if (interaction.commandName === "serverinfo") {
        const guild = interaction.guild;

        if (!guild) {
            await interaction.reply("This command can only be used in a server.");
            return;
        }

        const guildIcon = guild.iconURL({ size: 256 });

        await interaction.reply({
            embeds: [
            {
                title: "Server Info",
                color: 0x57f287,
                thumbnail: guildIcon ? { url: guildIcon } : undefined,
                fields: [
                { name: "Server Name", value: guild.name, inline: true },
                { name: "Server ID", value: guild.id, inline: true },
                { name: "Members", value: `${guild.memberCount}`, inline: true },
                {
                    name: "Created",
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                    inline: true
                },
                {
                    name: "Owner ID",
                    value: guild.ownerId ?? "Unknown",
                    inline: true
                }
                ]
            }
            ]
        });
        return;
    }

    if (interaction.commandName === "catfact") {
        await interaction.deferReply();

        try {
            const response = await axios.get("https://catfact.ninja/fact");
            await interaction.editReply(`Cat Fact:\n${response.data.fact}`);
        } catch (error) {
            await interaction.editReply("Failed to fetch a cat fact.");
        }

        return;
    }

    if (interaction.commandName === "joke") {
        await interaction.deferReply();

        try {
            const response = await axios.get(
            "https://official-joke-api.appspot.com/random_joke"
            );

            await interaction.editReply(
            `${response.data.setup}\n\n${response.data.punchline}`
            );
        } catch (error) {
            await interaction.editReply("Failed to fetch a joke.");
        }

        return;
    }

        await interaction.reply("I do not know this command yet.");

    } catch (error) {
        console.error(error);

}
});

client.login(process.env.DISCORD_TOKEN);