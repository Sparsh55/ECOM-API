import { ApplicationError } from "../../error-handler/application.error.js";
import { getDB, getClient } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import OrderModel from "./order.model.js";

// Remember to update stock from mongoDB shell
// db.products.updateMany({}, {$set:{stock:20}})

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {

    const client = getClient();

    const session =  client.startSession();

    try {

      session.startTransaction();

      const db = await getDB();

      // 1. Get cartitems and calculate total amount

      const items = await this.getTotalAmount(userId, session);
      const totalAmount = items.reduce((acc, item) => acc + item.totalPrice, 0);
      console.log(totalAmount);

      // 2. Create an order record

      const newOrder = new OrderModel(
        new ObjectId(userId),
        totalAmount,
        new Date()
      );
      db.collection(this.collection).insertOne(newOrder, session);

      // 3. Reduce the stock

      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            {session}
          );
      }

      // 4. Create the cart items

      await db.collection("cartItems").deleteMany({
        userId: new ObjectId(userId),
      },{session});

      session.commitTransaction();

      session.endSession();

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async getTotalAmount(userId, session) {
    try {
      const db = await getDB();
      const items = await db
        .collection("cartItems")
        .aggregate([
          // 1. Get cart items of the user
          {
            $match: { userId: new ObjectId(userId) },
          },
          // 2. Group by product id to count quantity
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          // 3. Unwind the product info
          {
            $unwind: "$productInfo",
          },
          // 4. Calculate total amount for each cart items
          {
            $addFields: {
              totalPrice: { $multiply: ["$quantity", "$productInfo.price"] },
            },
          },
        ], {session})
        .toArray();

      return items;
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}
