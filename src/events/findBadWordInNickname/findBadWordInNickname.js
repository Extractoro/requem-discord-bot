import userProfile from "./userProfile.js";
import User from "../../db/userSchema.js";

const findBadWordInNickname = (client, array) => {
  client.on("guildMemberAdd", async (member) => {
    await userProfile(member.user);

    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      const splitUsername = member.user?.username.toLowerCase().split(" ");

      for (let j = 0; j < splitUsername.length; j++) {
        const el = splitUsername[j];

        if (el.toLowerCase() === element.toLowerCase()) {
          member.setNickname("запрещенный ник");

          member
            .send(
              `Ваш никнейм на сервере был изменен на "**запрещенный ник**". Пожалуйста, измените его по желанию.`
            )
            .catch((err) => err);

          // await userProfile(member.user);
          // let user = await User.findOne({ discordId: member.user.id });

          //           if (user?.nicknameWarns === 1) {
          //             const result = await User.findByIdAndUpdate(
          //               user?._id,
          //               { discordName: member.user.username },
          //               {
          //                 new: true,
          //               }
          //             );
          //             await result.save().catch(console.error);

          //             if (user?.discordName === element.toLowerCase()) {
          //               setTimeout(async () => {
          //                 await userProfile(member.user);
          //                 member.timeout(1000 * 60 * 60 * 24 * 3);
          //                 member
          //                   .send(
          //                     `Вы получили предупреждение на сервере Requiem по причине: Неудовлетворительный никнейм. У вас предупреждений: **${2}**.

          // Измените свой никнейм в течении 7 дней, иначе вы получите **__бан__**.
          //             `
          //                   )
          //                   .catch((err) => err);
          //               }, 30000);
          //             } else {
          //               console.log("Cancel!");
          //             }

          //             setTimeout(async () => {
          //               await userProfile(member.user);
          //               member.ban({
          //                 deleteMessageSeconds: 1000 * 60,
          //                 reason: "Не изменил ник. NicknameWarns: 3",
          //               });
          //               member
          //                 .send(
          //                   `
          // Вы были забанены на сервере Requeim по причине: Неудовлетворительный никнейм.`
          //                 )
          //                 .catch((err) => err);
          //               await User.findOneAndDelete({
          //                 discordId: member.user.id,
          //               });
          //             }, 1000 * 60 * 60 * 24 * 10);
          //           }

          //           member
          //             .send(
          //               `Вы получили предупреждение на сервере Requiem по причине: Неудовлетворительный никнейм. У вас предупреждений: **${
          //                 user ? user?.nicknameWarns : null
          //               }**.

          // Измените свой никнейм в течении 3 дней, иначе вы получите **__тайм-аут на 3 дня__**.
          //             `
          //             )
          //             .catch((err) => err);
        }
      }
    }
  });
};

export default findBadWordInNickname;
