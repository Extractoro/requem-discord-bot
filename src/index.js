import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";

import badWords from "./badWords.json" assert { type: "json" };

config();
const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
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

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
});

client.on("messageCreate", (message) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    const splitMessage = message.content.toLowerCase().split(" ");

    for (let j = 0; j < splitMessage.length; j++) {
      const el = splitMessage[j];

      if (el === element.toLowerCase()) {
        message.delete();
        message.author.send("Bad!");
      }
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log("hello, world!");
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
