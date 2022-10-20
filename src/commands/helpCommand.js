import { SlashCommandBuilder } from "discord.js";

const helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Команда-помогатор");

export default helpCommand.toJSON();
