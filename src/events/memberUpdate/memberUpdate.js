import User from "../../db/userSchema.js";
import memberUpdateMongo from "./memberUpdateMongo.js";

const memberUpdate = async (member, array) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    const splitUsername = member.user?.username.toLowerCase().split(" ");
    if (member?.nickname !== null) {
      var splitServerNickname = member?.nickname.toLowerCase().split(" ");
    }

    for (let j = 0; j < splitUsername.length; j++) {
      const el = splitUsername[j];
      if (splitServerNickname !== undefined) {
        var servEl = splitServerNickname[j];
      }

      if (
        servEl === element.toLowerCase() ||
        (member?.nickname === null &&
          el.toLowerCase() === element.toLowerCase())
      ) {
        await memberUpdateMongo(member);
        let user = await User.findOne({ discordId: member.user.id });
        member.setNickname("запрещенный ник");

        if (user?.nicknameWarns === 5) {
          await member.timeout(1000 * 60 * 60 * 24 * 7);

          const result = await User.findByIdAndUpdate(
            user?._id,
            { nicknameWarns: 5 },
            {
              new: true,
            }
          );
          await result.save().catch(console.error);

          var fiveNicknameWarns = `
Вы получили тайм-аут на 7 дней, так как у вас уже 5 предупреждений (Недопустимый никнейм). Пожалуйста, ознакомьтесь с таблицей предупреждений (||__**/help и выбрать категорию Warns**__||) и не нарушайте впредь!`;
        }

        if (user?.nicknameWarns === 10) {
          member.ban({
            deleteMessageSeconds: 1000 * 60,
            reason: "10 nickname warns",
          });
          var tenNicknameWarns = `
Вы получили бан на сервере, так как у вас уже 10 предупреждений (Недопустимый никнейм).`;
        }

        if (user?.nicknameWarns < 5) {
          var fiveNicknameWarnsMessage = `
До следующего наказания (тайм-аут на 7 дней) вам осталось: ${
            5 - user?.nicknameWarns
          } предупреждений`;
        }

        if (user?.nicknameWarns > 5 && user?.nicknameWarns < 10) {
          var tenNicknameWarnsMessage = `
До следующего наказания (бан на сервере) вам осталось: ${
            10 - user?.nicknameWarns
          } предупреждений`;
        }

        member
          .send(
            `Вы получили предупреждение на сервере по причине: Недопустимый никнейм. У вас предупреждений: **${
              user ? user?.nicknameWarns : null
            }**.
              ${user?.nicknameWarns === 5 ? fiveNicknameWarns : ""}${
              user?.nicknameWarns === 10 ? tenNicknameWarns : ""
            }${user?.nicknameWarns < 5 ? fiveNicknameWarnsMessage : ""}${
              user?.nicknameWarns > 5 && user?.nicknameWarns < 10
                ? tenNicknameWarnsMessage
                : ""
            }`
          )
          .catch((err) => err);

        if (user?.nicknameWarns === 10) {
          await User.findOneAndDelete({
            discordId: member.user.id,
          });
        }
      }
    }
  }
};

export default memberUpdate;
