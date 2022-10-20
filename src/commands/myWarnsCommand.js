import { SlashCommandBuilder } from "discord.js";

const myWarnsCommand = new SlashCommandBuilder()
  .setName("my-warns")
  .setDescription("Узнать о своих предупреждениях");

export default myWarnsCommand.toJSON();
