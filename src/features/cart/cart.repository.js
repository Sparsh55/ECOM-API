import { ApplicationError } from "../../error-handler/application.error.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class CartRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productId, userId, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      await collection.updateOne(
        { productId: new ObjectId(productId), userId: new ObjectId(userId) },
        {
          $setOnInsert: {_id:id},
          $inc: {
            quantity: quantity,
          },
        },
        { upsert: true }
      );
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async get(userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async delete(cartItemId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
    
    return resultDocument.value;
  }
}
