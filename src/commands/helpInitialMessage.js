import { EmbedBuilder, ComponentType } from "discord.js";
import User from "../db/userSchema.js";

const helpSelector = async (interaction, actionRowSelect) => {
  const embed = new EmbedBuilder().setDescription(
    "Пожалуйста, выберите категорию в раскрывающемся меню"
  );

  const formatString = (str) =>
    `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

  const initialMessage = interaction?.reply({
    embeds: [embed],
    components: actionRowSelect(false),
  });

  let user = await User.findOne({ discordId: interaction.user.id });
  const filter = (interaction) => interaction.user.id === user.discordId;

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    componentType: ComponentType.SelectMenu,
  });

  collector.on("collect", async (interaction) => {
    const [directory] = interaction.values;

    const categoryEmbed = new EmbedBuilder()
      .setTitle(`${formatString(directory)}`)
      .setAuthor({
        name: `${`${interaction.user.username}#${interaction.user.discriminator}`}`,
        iconURL: `${
          interaction.user.avatar !== null
            ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`
            : "https://cdn.discordapp.com/embed/avatars/0.png"
        }`,
      })
      .setDescription(
        `
Вы: **${`${user?.discordName}#${user?.discordHashtag}`}**
Количество ваших предупреждений (Плохие слова): **${user?.warns}**
Количество ваших предупреждений (Недопустимый никнейм): **${
          user?.nicknameWarns
        }**`
      )

      .setFields(
        { name: "\u200B", value: "\u200B" },
        { name: "🤬 Плохие слова", value: "-------------------------" },
        { name: "10 предупреждений", value: "⏲️ Тайм-аут на 3 дня" },
        {
          name: "20 предупреждений",
          value: "🤐 Роль <@&1031267947198545920> на 14 дней",
        },
        {
          name: "30 предупреждений",
          value: "⛔ Бан на сервере",
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "💢 Недопустимый никнейм",
          value: "-------------------------",
        },
        { name: "5 предупреждений", value: "⏲️ Тайм-аут на 7 дня" },
        { name: "10 предупреждений", value: "⛔ Бан на сервере" }
      );

    await interaction
      .update({
        embeds: [categoryEmbed],
      })
      .catch((err) => err);
  });

  collector.on("end", () => {
    initialMessage?.editReply({ components: actionRowSelect(true) });
  });
};

export default helpSelector;
