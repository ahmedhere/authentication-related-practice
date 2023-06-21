const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModels");

class UserDAL {
  constructor(constr) {
    this.constr = constr;
    this.mongoose = mongoose;
  }
  async addUser(user) {
    try {
      await this.mongoose.connect(this.constr);
      const { name, username, password } = user;
      const newUser = new User({ name, username, password });
      await newUser.save();
      return { success: true, newUser };
    } catch (e) {
      return { error: true, e };
    } finally {
      await this.mongoose.connection.close();
    }
  }
  async verify(user) {
    try {
      await this.mongoose.connect(this.constr);
      const { username, password } = user;
      const result = await User.findAndValidate(username, password);
      return { success: true, result };
    } catch (e) {
      return { error: true, e };
    } finally {
      await this.mongoose.connection.close();
    }
  }
  async updateProfile(id, user) {
    try {
      await this.mongoose.connect(this.constr);
      const { name } = user;
      const result = await User.findByIdAndUpdate(id, { name }, { new: true });
      return { success: true, result };
    } catch (e) {
      return { error: true, e };
    } finally {
      await this.mongoose.connection.close();
    }
  }
  async updatePassword(id, user) {
    try {
      await this.mongoose.connect(this.constr);
      const { password } = user;
      const value = await bcrypt.hash(password, 10);
      const result = await User.findByIdAndUpdate(
        id,
        { password: value },
        { new: true }
      );
      return { success: true, result };
    } catch (e) {
      console.log(e);
      return { error: true, e };
    } finally {
      await this.mongoose.connection.close();
    }
  }
}

module.exports = UserDAL;
