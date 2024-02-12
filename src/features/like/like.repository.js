import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model("Like", likeSchema)

export class LikeRepository{

    async likeProduct(userId, productId){
        try {

            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                on_model: "Product"
            });

            await newLike.save();
            
        } catch (error) {
            throw new ApplicationError("Something went wrong", 503);
        }
    }

    async likeCategory(userId, categoryId){
        try {

            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                on_model: "Category"
            });

            await newLike.save();
            
        } catch (error) {
            throw new ApplicationError("Something went wrong", 503);
        }
    }

    async getLikes(type, id){

        try {

            return await LikeModel.find({
                likeable : new ObjectId(id),
                on_model : type
            }).populate("user").populate({path: "likeable", model: type});
            
        } catch (error) {
            throw new ApplicationError("Something went wrong", 503);
        }

        

    }

}