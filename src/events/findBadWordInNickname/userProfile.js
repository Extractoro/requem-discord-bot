import User from "../../db/userSchema.js";
import mongoose from "mongoose";

const userProfile = async (author) => {
  let user = await User.findOne({ discordId: author.id });
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
      discordId: author.id,
      discordName: author.username,
      discordHashtag: author.discriminator,
      nicknameWarns: 1,
    });

    await user.save().catch(console.error);
  }
};

export default userProfile;
