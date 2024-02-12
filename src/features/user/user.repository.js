import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/application.error.js";

const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async SignUp(user) {
    try {
      // Create instance of model
      const newUser = new UserModel(user);
      // Save the user
      await newUser.save();
      // Return the user
      return newUser;
    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){
        throw error;
      }else{
        throw new ApplicationError("Something went wrong", 503);
      }
      
    }
  }

  async SignIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async resetPassword(userId, newPassword) {
    try {
      let user = await UserModel.findById(userId);
      user.password = newPassword;
      return user.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}
