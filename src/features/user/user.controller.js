import UserModel from "./user.model.js";
import jsonwebtoken from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import { ApplicationError } from "../../error-handler/application.error.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res){
    try {
      const {newPassword} = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const userId = req.userId;
      await this.userRepository.resetPassword(userId, hashedPassword);
      res.status(204).send("Password is Updated");
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(name, email, hashedPassword, type);
      await this.userRepository.SignUp(user);
      res.status(201).send(user);
    } catch (err) {

      next(err);

    }
  }

  async signIn(req, res) {
    try {
      const user = await this.userRepository.findByEmail(req.body.email);

      if (!user) {
        res.status(400).send("Email or Password is incorrect");
      } else {
        const validated = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validated) {
          res.status(400).send("Email or Password is incorrect");
        } else {
          const token = jsonwebtoken.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
          );

          return res.status(200).send(token);
        }
      }
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}
