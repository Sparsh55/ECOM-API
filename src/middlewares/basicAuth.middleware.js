import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
    // 1. Check if authorization header is empty

    const authHeader = req.headers["authorization"];

    if(!authHeader){
        res.status(401).send("No authorization details found");
    }

    // 2. Extract credentials  
    console.log(authHeader);

    const base64Credentials = authHeader.replace('Basic ','');

    console.log(base64Credentials);

    // 3. Decode credentials

    const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf-8');

    console.log(decodedCreds);

    const creds = decodedCreds.split(':');

    const user = UserModel.getUsers().find(u => u.email == creds[0] && u.password == creds[1]);

    if(user){
        next();
    }else{
        res.status(401).send("Incorrect Credentials");
    }

}


export default basicAuthorizer;