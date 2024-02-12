import OrderRepository from "./order.repository.js";
import { ApplicationError } from "../../error-handler/application.error.js";
export default class OrderController{
    constructor(){
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req, res){
        try {

            const userId = req.userId;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("Order is placed")
            
        } catch (error) {
            throw new ApplicationError("Something went wrong", 503);
        }
    }
}