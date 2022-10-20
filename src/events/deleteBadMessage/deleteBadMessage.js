import userProfile from "./userProfile.js";
import User from "../../db/userSchema.js";

const deleteBadMessage = async (message, array) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    const splitMessage = message.content.toLowerCase().split(" ");

    for (let j = 0; j < splitMessage.length; j++) {
      const el = splitMessage[j];

      if (el === element.toLowerCase()) {
        await userProfile(message.author);
        let user = await User.findOne({ discordId: message.author.id });

        if (user?.warns === 10) {
          message.member.timeout(1000 * 60 * 60 * 24 * 3);
        }

        if (user?.warns === 20) {
          var role = message.guild.roles.cache.find(
            (role) => role.name === "Muted chat"
          );
          message.member.roles.add(role);

          setTimeout(() => {
            message.member.roles.remove(role);
          }, 604800 * 1000);
        }

        if (user?.warns === 10) {
          var tenWarns = `
Вы получили тайм-аут на 3 дня, так как у вас уже 10 предупреждений (Плохие слова).`;
        }

        if (user?.warns === 20) {
          var twelveWarns = `
Вы получили роль Muted chat на 14 дней, так как у вас уже 20 предупреждений (Плохие слова).`;
        }

        if (user?.warns === 30) {
          var thirtyWarns = `
Вы были забанены на сервере, так как вы набрали 30 предупреждений (Плохие слова).`;
        }

        if (user?.warns < 10) {
          var tenMessage = `
До следующего наказания (тайм-аут на 3 дня) вам осталось: ${
            10 - user?.warns
          } предупреждений`;
        }

        if (user?.warns > 10 && user?.warns < 20) {
          var twentyMessage = `
До следующего наказания (роль Muted chat на 14 дней) вам осталось: ${
            20 - user?.warns
          } предупреждений`;
        }

        if (user?.warns > 20 && user?.warns < 30) {
          var thirtyMessage = `
До следующего наказания (бан на сервере) вам осталось: ${
            30 - user?.warns
          } предупреждений`;
        }

        message.author
          .send(
            `${
              user?.warns !== 10 && user?.warns !== 20 && user?.warns !== 30
                ? `Вы получили предупреждение на сервере по причине: Плохие слова. У вас предупреждений: **${
                    user ? user?.warns : null
                  }**. Пожалуйста, ознакомьтесь с таблицей предупреждений (||__**/help и выбрать категорию Warns**__||) и не нарушайте впредь!`
                : ""
            }
            ${user?.warns < 10 ? tenMessage : ""}${
              user?.warns > 10 && user?.warns < 20 ? twentyMessage : ""
            }${user?.warns > 20 && user?.warns < 30 ? thirtyMessage : ""}${
              user?.warns === 10 ? tenWarns : ""
            }${user?.warns === 20 ? twelveWarns : ""}${
              user?.warns === 30 ? thirtyWarns : ""
            }
            `
          )
          .catch((err) => err);
        message.delete().catch((err) => err);

        if (user?.warns === 30) {
          await message.member.ban({
            deleteMessageSeconds: 1000 * 60,
            reason: "Набрал 30 варнов",
          });

          await User.findOneAndDelete({
            discordId: message.author.id,
          });
        }
      }
    }
  }
};

export default deleteBadMessage;
