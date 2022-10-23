import { config } from "dotenv";
import {
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SelectMenuBuilder,
  EmbedBuilder,
  ComponentType,
} from "discord.js";
import { connect } from "mongoose";

import badWords from "./badWords.json" assert { type: "json" };
import deleteBadMessage from "./events/deleteBadMessage/deleteBadMessage.js";
import findBadWordInNickname from "./events/findBadWordInNickname/findBadWordInNickname.js";
import memberUpdate from "./events/memberUpdate/memberUpdate.js";
import helpCommand from "./commands/helpCommand.js";
import myWarnsCommand from "./commands/myWarnsCommand.js";
import User from "./db/userSchema.js";
// import helpMessage from "./messages/helpMessage.js";
import helpInitialMessage from "./commands/helpInitialMessage.js";
// import helpSelector from "./commands/helpSelector.js";

config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const MONGODB_URL = process.env.MONGODB_URL;
const { array } = badWords;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

client.login(TOKEN);
(async () => {
  await connect(MONGODB_URL, { dbName: "db" })
    .then(console.log("Connected!"))
    .catch(console.error);
})();

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);

  findBadWordInNickname(client, array);
});

client.on("messageCreate", (message) => {
  const roleId = "1029832160238117005";
  if (!message.member.roles.cache.has(roleId)) {
    deleteBadMessage(message, array);
  }
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  memberUpdate(newMember, array);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "help") {
      const actionRowSelect = (state) => [
        new ActionRowBuilder().setComponents(
          new SelectMenuBuilder()
            .setCustomId("help_options")
            .setDisabled(state)
            .setOptions([
              {
                label: "Warns",
                value: "предупреждения",
                description: "Узнать о всю информацию об предупреждениях",
                emoji: "⚠️",
              },
            ])
        ),
      ];
      await helpInitialMessage(interaction, actionRowSelect);
    }
    // else if (interaction.commandName === "my-warns") {
    //   let user = await User.findOne({ discordId: interaction.user.id });
    //   const myWarnsMessage = new EmbedBuilder()
    //     .setTitle("Мои предупреждения")
    //     .setAuthor({
    //       name: `${`${interaction.user.username}#${interaction.user.discriminator}`}`,
    //       iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`,
    //     })
    //     .addFields({ name: "", value: "" });

    //   interaction.reply({ embeds: [myWarnsMessage] });
    // }
  }
});

async function main() {
  const commands = [helpCommand];

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (err) {
    console.log(err);
  }
}

main();
