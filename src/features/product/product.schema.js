import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imgUrl: String,
    stock: Number,
    sizes: [
        { type:String }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ],

});