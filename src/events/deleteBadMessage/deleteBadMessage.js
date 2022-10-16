import userProfile from "../userProfile/userProfile.js";
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
          message.member.timeout(1000 * 60 * 60 * 24 * 7);
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

        if (user?.warns === 30) {
          message.member.ban({
            deleteMessageSeconds: 60 * 60 * 24 * 7,
            reason: "Вы набрали 30 варнов",
          });

          await User.findOneAndDelete({
            discordId: message.author.id,
          });
        }

        message.author
          .send(
            `Вы получили предупреждение на сервере Requiem по причине: Плохие слова. У вас предупреждений: ${
              user ? user?.warns : null
            }`
          )
          .catch((err) => err);
        message.delete().catch((err) => err);
      }
    }
  }
};

export default deleteBadMessage;
