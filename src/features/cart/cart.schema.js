import mongoose from "mongoose";
import { ApplicationError } from "../error-handler/application.error.js";

export const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: Number
});