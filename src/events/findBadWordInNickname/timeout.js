import userProfile from "./userProfile.js";

const timeoutNickname = (nickname, element, member) => {
  setTimeout(async () => {
    if (nickname === element) {
      console.log("new", nickname);
      //   setTimeout(async () => {
      await userProfile(member.user);
      member.timeout(1000 * 60 * 60 * 24 * 3);
      member
        .send(
          `Вы получили предупреждение на сервере Requiem по причине: Неудовлетворительный никнейм. У вас предупреждений: **${2}**.

Измените свой никнейм в течении 7 дней, иначе вы получите **__бан__**.
            `
        )
        .catch((err) => err);
      //   }, 40000);
    }
  }, 40000);
};

export default timeoutNickname;
