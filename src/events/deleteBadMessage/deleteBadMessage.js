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
Вы получили тайм-аут на 3 дня, так как у вас уже 10 предупреждений. Пожалуйста, ознакомьтесь с таблицей предупреждений (||__**/help warns**__||) и не нарушайте впредь!`;
        }

        if (user?.warns === 20) {
          var twelveWarns = `
Вы получили роль Muted chat на 14 дней, так как у вас уже 20 предупреждений. Пожалуйста, ознакомьтесь с таблицей предупреждений (||__**/help warns**__||) и не нарушайте впредь!`;
        }

        if (user?.warns === 30) {
          var thirtyWarns = `
Вы были забанены на сервере Requeim, так как вы набрали 30 предупреждений.`;
        }

        if (user?.warns === 30) {
          message.member.ban({
            deleteMessageSeconds: 1000 * 60,
            reason: "Набрал 30 варнов",
          });
        }

        message.author
          .send(
            `Вы получили предупреждение на сервере Requiem по причине: Плохие слова. У вас предупреждений: **${
              user ? user?.warns : null
            }**.
            ${user?.warns === 10 ? tenWarns : ""}${
              user?.warns === 20 ? twelveWarns : ""
            }${user?.warns === 30 ? thirtyWarns : ""}
             
            
            `
          )
          .catch((err) => err);
        message.delete().catch((err) => err);

        if (user?.warns === 30) {
          await User.findOneAndDelete({
            discordId: message.author.id,
          });
        }
      }
    }
  }
};

export default deleteBadMessage;
