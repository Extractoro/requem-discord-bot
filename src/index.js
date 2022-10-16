import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { connect } from "mongoose";

import badWords from "./badWords.json" assert { type: "json" };
import deleteBadMessage from "./events/deleteBadMessage/deleteBadMessage.js";

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
});

client.on("messageCreate", (message) => {
  deleteBadMessage(message, array);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    interaction.reply({ content: "Hey, there!" });
  }
});

async function main() {
  const commands = [
    {
      name: "help",
      description: "help!",
    },
  ];

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
