import mongoose from "mongoose";
import { ApplicationError } from "../error-handler/application.error.js";
import { categorySchema } from "../features/product/category.schema.js";


export const connectUsingMongoose = async() => {

    try {

        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        addCategories();
        console.log("MongoDB connected using Mongoose");
        
        
    } catch (error) {
        throw new ApplicationError("Something went wrong", 503);
    }
    
}


async function addCategories(){
    const categoryModel = mongoose.model("Category", categorySchema);
    const categories = await categoryModel.find();

    if(!categories || categories.length==0){
        await categoryModel.insertMany([{name: "Book"}, {name: "Clothing"}, {name: "Electronics"}]);
    }
    console.log("Categories added!");
}

