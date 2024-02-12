// Manage Route paths to product controller

// Import express
import express from 'express';

// Import cart controller
import CartController from './cart.controller.js';


// Initialize express routers
const cartRouter = express.Router();

// Instantiate the Product Controller
const cartController = new CartController();

// All the paths to controller methods
cartRouter.post("/", (req, res) => {
    cartController.addToCart(req,res);
});
cartRouter.get("/", (req, res) => {
    cartController.getCart(req,res);
});
cartRouter.delete("/:id", (req, res) => {
    cartController.delete(req,res);
});

export default cartRouter;

