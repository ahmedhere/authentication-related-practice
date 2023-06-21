const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name should be in the request"],
  },
  username: {
    type: String,
    required: [true, "Username should be mentioned"],
  },
  password: {
    type: String,
    required: [true, "Password should be entered"],
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.statics.findAndValidate = async function (username, password) {
  const findUser = await this.findOne({ username: username });
  if (findUser) {
    const result = await bcrypt.compare(password, findUser.password);
    return result ? findUser : false;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
