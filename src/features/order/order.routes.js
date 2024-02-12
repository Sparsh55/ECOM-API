// Manage Route paths to product controller

// Import express

import express from 'express';

// Import cart controller

import OrderController from './order.controller.js';

// Initialize express routers

const orderRouter = express.Router();

// Instantiate the Order Controller

const orderController = new OrderController();

// All the paths to controller methods

orderRouter.post("/", (req, res) => {
    orderController.placeOrder(req,res);
});


export default orderRouter;