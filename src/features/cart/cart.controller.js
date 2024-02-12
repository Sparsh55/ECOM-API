import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";
import { ApplicationError } from "../../error-handler/application.error.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;
      await this.cartRepository.add(productId, userId, quantity);
      res.status(201).send("Cart is Updated");
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async getCart(req, res) {
    try {
      const userId = req.userId;
      const cartItems = await this.cartRepository.get(userId);
      if (cartItems) {
        res.status(200).send(cartItems);
      } else {
        res.status(404).send("No items in the cart");
      }
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async delete(req, res) {
    try {
      const cartItemId = req.params.id;
      const result = await this.cartRepository.delete(cartItemId);
      if (result) {
        res.status(200).send("The cart item has been removed");
      } else {
        res.status(400).send("Item not found");
      }
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}
