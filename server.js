// Import environment variable
import "./env.js";

// Import Express
import express from "express";

// Import swagger UI
import swagger from "swagger-ui-express";

// import Body Parser
import bodyParser from "body-parser";

// import CORS

import cors from 'cors';

// Import product routers
import productRouter from "./src/features/product/product.routes.js";

// Import user routers
import userRouter from "./src/features/user/user.routes.js";

// Import cart router
import cartRouter from "./src/features/cart/cart.routes.js";

// Import order router
import orderRouter from "./src/features/order/order.routes.js";

// Import like router

import likeRouter from "./src/features/like/like.routes.js";

// Import Authentication
import jwtAuth from "./src/middlewares/jwt.middleware.js";


// Import Swagger JSON
import apiDocs from "./swagger.json" assert {type:'json'};


import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/application.error.js";
import {connectToMongodb} from "./src/config/mongodb.js";
import { connectUsingMongoose } from "./src/config/mongoose.config.js";
import mongoose from "mongoose";



//  Create Server
const app = express();


// CORS Policy configuration
app.use(cors());


// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin","*");
//     res.header("Access-Control-Allow-Headers","*");
//     res.header('Access-Control-Allow-Methods', '*');

//     if(req.method=="OPTIONS"){
//         res.sendStatus(200);
//     }

//     next();
// })

// parse as JSON
app.use(bodyParser.json());

app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

app.use(loggerMiddleware)

// For all requests related to cart
app.use("/api/cart", jwtAuth ,cartRouter)

// For all requests related to oder
app.use("/api/orders", jwtAuth ,orderRouter)

// For all requests related to products redirect to product roots
app.use("/api/products", jwtAuth ,productRouter);

// For all requests related to users 
app.use("/api/users",userRouter)

// For all requests related to likes
app.use("/api/likes", jwtAuth ,likeRouter);


// Error Handling middleware
app.use((err, req, res, next) => {
    
    if(err instanceof mongoose.Error.ValidationError){
        return res.send(err.message);
    }

    if(err instanceof ApplicationError){
        return res.status(err.code).send(err.message);
    }
    res.status(500).send("Something went wrong, Please try later");
})

// Middleware to handle 404 request
app.use((req,res)=>{
    res.status(404).send({message: '404 Not Found!'})
});



// Listen on port 3000
// 65535
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    // connectToMongodb();
    connectUsingMongoose();
})

