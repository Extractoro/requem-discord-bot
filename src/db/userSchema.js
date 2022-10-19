import { Schema, model } from "mongoose";

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  discordId: { type: String },
  discordName: { type: String },
  discordHashtag: { type: String },
  warns: { type: Number, default: 0 },
  nicknameWarns: { type: Number, default: 0 },
  statusWarns: { type: Number, default: 0 },
});

const User = model("user", userSchema, "users");

export default User;
