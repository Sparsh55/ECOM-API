import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/application.error.js";

class UserRepository {
  constructor() {
    this.collection = "users";
  }

  async SignUp(user) {
    try {
      // 1. Get the database
      const db = getDB();

      // 2. Get the collection
      const collection = db.collection(this.collection);

      // 3. Insert the document
      await collection.insertOne(user);

      return user;
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async SignIn(email, password) {
    try {
      // 1. Get the database
      const db = getDB();

      // 2. Get the collection
      const collection = db.collection(this.collection);

      // 3. Insert the document
      return await collection.findOne({ email, password });
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async findByEmail(email) {
    try {
      // 1. Get the database
      const db = getDB();

      // 2. Get the collection
      const collection = db.collection("users");

      // 3. Insert the document
      return await collection.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}

export default UserRepository;
