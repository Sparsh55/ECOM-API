import { body, validationResult } from "express-validator";

export default class Validator{

    static userSignUpRules(){
        return [
            body('name').notEmpty().withMessage("Name cannot be empty"),
            body('email').isEmail().withMessage("Please enter a valid email id"),
            body('password').isLength({ min:4 }).withMessage("Minimum character of password must be 4"),
        ]
    }

    static userSignInRules(){
        return [
            body('email').isEmail().withMessage("Please enter a valid email id"),
            body('password').isLength({ min:4 }).withMessage("Minimum character of password must be 4"),
        ]
    }

    static validate(req,res,next){
        const errors = validationResult(req);
         if (errors.isEmpty()) {
            
            next();
        
        }else{

            const extractedErrors = [];
            errors.array().map(err => extractedErrors.push({[err.path]:err.msg}))
            res.status(422).json({errors:extractedErrors})
        }
    }


}