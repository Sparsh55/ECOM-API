import  jsonwebtoken  from "jsonwebtoken";

const jwtAuth = (req,res,next)=>{
    // 1. Read the token

    const token = req.headers["authorization"];

    // 2. If no token, return the error

    if(!token){
        return res.status(401).send("Unauthorized");
    }

    // 3. Check if token is valid

    try{

        const payload = jsonwebtoken.verify(token,process.env.JWT_SECRET);

        req.userId = payload.userID;

    }catch(err){

        return res.status(401).send("Unauthorized");

    }


    // 4. Call next middleware

    next();

}

export default jwtAuth;