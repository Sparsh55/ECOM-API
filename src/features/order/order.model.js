export default class OrderModel{
    constructor(userId, totalAmount, timestamp){
        this.id = userId;
        this.total_amount = totalAmount;
        this.timestamp = timestamp;
    }
}