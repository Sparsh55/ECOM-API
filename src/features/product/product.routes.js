// Manage Route paths to product controller

// Import express

import express from "express";

// Import product controller

import ProductController from "./product.controller.js";
import upload from "../../middlewares/file-upload.middleware.js";

// Initialize express routers

const productRouter = express.Router();

// Instantiate the Product Controller

const productController = new ProductController();

// All the paths to controller methods
productRouter.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});
productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post("/", upload.single("imgUrl"), (req, res) => {
  productController.addProduct(req, res);
});
productRouter.get("/avgPrice", (req, res) => {
  productController.averagePrice(req, res);
});
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});


export default productRouter;
