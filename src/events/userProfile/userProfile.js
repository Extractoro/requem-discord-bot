import User from "../../db/userSchema.js";
import mongoose from "mongoose";

const userProfile = async (author) => {
  let user = await User.findOne({ discordId: author.id });
  let userWarns = user?.warns + 1;

  if (user) {
    const result = await User.findByIdAndUpdate(
      user?._id,
      { warns: userWarns },
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
      warns: 1,
    });

    await user.save().catch(console.error);
  }
};

export default userProfile;
