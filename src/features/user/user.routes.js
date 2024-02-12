// Manage Route paths to product controller

// Import express

import express from 'express';

// Import product controller

import { UserController } from './user.controller.js';
import Validator from '../../middlewares/validator.middleware.js';
import jwtAuth from "./../../middlewares/jwt.middleware.js";

// Initialize express routers

const userRouter = express.Router();

userRouter.use(express.urlencoded({ extended: true }));


// Instantiate the Product Controller

const userController = new UserController();

// All the paths to controller methods

userRouter.post("/signup", Validator.userSignUpRules(), Validator.validate , (req, res, next)=> {
    userController.signUp(req,res, next);
});
userRouter.post("/signin", Validator.userSignInRules(), Validator.validate , (req, res)=> {
    userController.signIn(req,res) ;
});
userRouter.put("/resetPassword", jwtAuth , (req, res)=> {
    userController.resetPassword(req,res) ;
});




export default userRouter;