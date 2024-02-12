export default class CartModel{
    constructor(id, productId, userId, quantity){
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.quantity = quantity || 1;
    }

    static add(productId, userId, quantity){

        const cartItem = new CartModel(cartItems.length+1, productId, userId, quantity);
        cartItems.push(cartItem);
        return cartItem;
    }

    static getAll(id){
        const items = cartItems.filter(i => i.userId == id);
        return items;
    }

    static delete(userId, cartItemId){
        const items = cartItems.findIndex(i => i.id == cartItemId && i.userId == userId);
        if(items == -1){
            return {
                success: false,
                message: 'Cart item not found'
            };
        }else{
            cartItems = cartItems.filter(i => i.id != cartItemId && i.userId == userId);
            return {
                success: true,
                message: "Deleted"
            };
        }
    }

}


var cartItems = [
    new CartModel(1, "dde1f882-2516-4967-9f62-55557d9a48ff", 1, 3),
    new CartModel(2, "dde1f882-2516-4967-9f62-55557d9a48ff", 2, 5),
    new CartModel(3, "1ec164ec-0cdd-439b-b3b6-e66109cb6e10", 1, 7)
]