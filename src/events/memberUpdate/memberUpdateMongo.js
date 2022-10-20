import mongoose from "mongoose";
import User from "../../db/userSchema.js";

const memberUpdateMongo = async (member) => {
  let user = await User.findOne({ discordId: member.user.id });
  let userNicknameWarns = user?.nicknameWarns + 1;

  if (user) {
    const result = await User.findByIdAndUpdate(
      user?._id,
      { nicknameWarns: userNicknameWarns },
      {
        new: true,
      }
    );
    await result.save().catch(console.error);
  }

  if (!user) {
    user = await new User({
      _id: mongoose.Types.ObjectId(),
      discordId: member.user.id,
      discordName: member.user.username,
      discordHashtag: member.user.discriminator,
      nicknameWarns: 1,
    });

    await user.save().catch(console.error);
  }
};

export default memberUpdateMongo;
