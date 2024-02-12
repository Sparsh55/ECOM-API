import ProductModel from "./product.model.js";
import path from "path";
import ProductRepository from "./product.repository.js";
import { ApplicationError } from "../../error-handler/application.error.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err)
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async addProduct(req, res) {
    try {
      const { name, description, price, categories, sizes } = req.body;

      const imgUrl = "/uploads/" + req.file.filename;

      const product = new ProductModel(
        name,
        description,
        parseFloat(price),
        imgUrl,
        categories.split(","),
        sizes.split(",")
      );

      const createdProduct = await this.productRepository.add(product);

      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async rateProduct(req, res) {
    try {
      const userId = req.userId;
      const productId = req.body.productId;
      const rating = req.body.rating;
      await this.productRepository.rate(userId, productId, rating);
      res.status(200).send("Rating has been added!");
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async getOneProduct(req, res) {
    try {
      const product = await this.productRepository.get(req.params.id);
      if (!product) {
        return res.status(404).send({ message: "No such product found" });
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;

      const filteredProducts = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );

      res.status(200).send(filteredProducts);
    } catch {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async averagePrice(req, res){
    try {
      const averagePrice = await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(averagePrice);
    } catch (error) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}
