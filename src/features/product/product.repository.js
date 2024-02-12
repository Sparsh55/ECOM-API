import  { ApplicationError }  from "../../error-handler/application.error.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);


class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {

      // New Code

      console.log(productData);

      // 1. Add Product
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();

      // 2. Update Categories

      await CategoryModel.updateMany(
        { _id: { $in : productData.categories } },
        { $push: { products: new ObjectId(savedProduct._id) }}
      );


      // Old Code
      // // 1. Get the database
      // const db = getDB();
      // // 2. Get the collection
      // const collection = db.collection(this.collection);
      // // 3. Insert a new product into the collection
      // await collection.insertOne(productData);
      // return productData;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async getAll() {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Get all the products
      return await collection.find().toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async get(id) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Get product by id
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);

      // 3. Filter products

      let filterExpression = {};

      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }

      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }

      if (category) {
        filterExpression.category = category;
      }

      // 4. Return filtered products

      return await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0 })
        .toArray();

      // return await collection
      //   .find({
      //     $or: [
      //       {
      //         price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
      //       },
      //       { category: category },
      //     ],
      //   })
      //   .toArray();
    } catch {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  // async rate(userId, productId, rating) {
  //   try {
  //     // 1. Get the database
  //     const db = getDB();
  //     // 2. Get the collection
  //     const collection = db.collection(this.collection);

  //     // 1. Find the product

  //     const product = await collection.findOne({_id:new ObjectId(productId)});

  //     // 2. Find the rating

  //     const userRating = product?.ratings?.find(r => r.userId == userId);

  //     if(userRating){

  //       // 3. Update the rating

  //       await collection.updateOne(
  //         { _id: new ObjectId(productId), "ratings.userId":new ObjectId(userId) },
  //         { $set: {"ratings.$.rating": rating} },
  //       )

  //     }else{
  //       collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //         },
  //         {
  //           $push: {
  //             ratings: {
  //               userId: new ObjectId(userId),
  //               rating,
  //             },
  //           },
  //         }
  //       );

  //     }

  //   } catch {
  //     throw new ApplicationError("Something went wrong", 503);
  //   }
  // }

  async rate(userId, productId, rating) {
    try {

      // New Code
      // 1. Check if product exists

      const productToUpdate = await ProductModel.findById(productId);


      if(!productToUpdate){
        throw new Error("Product Not Found!");
      }

      // Find the existing review

      const userReview = await ReviewModel.findOne({product: new ObjectId(productId), user: new ObjectId(userId)});

      if(userReview){
          userReview.rating = rating;
          await userReview.save();
      }else{
        const newReview = new ReviewModel({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
          rating: rating
        });

        productToUpdate.reviews.push(newReview._id);
        await productToUpdate.save();
        await newReview.save();
      }



      // Old Code

      // // 1. Get the database
      // const db = getDB();
      // // 2. Get the collection
      // const collection = db.collection(this.collection);

      // // 3. Removes existing entry

      // collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //   },
      //   {
      //     $pull: {
      //       ratings: {
      //         userId: new ObjectId(userId),
      //       },
      //     },
      //   }
      // );

      // // 4. Add new entry

      // collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //   },
      //   {
      //     $push: {
      //       ratings: {
      //         userId: new ObjectId(userId),
      //         rating,
      //       },
      //     },
      //   }
      // );
    } catch(err) {
      console.log('Error in addProductRating', err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async averageProductPricePerCategory() {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      return await db
        .collection(this.collection)
        .aggregate([
          {
            $group: {
              _id: "$category",
              avg_price: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}

export default ProductRepository;
