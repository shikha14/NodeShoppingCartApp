module.exports = function Cart(initItems) {
    this.items = initItems;
    this.totalQty = 0;
    this.totalPrice = 0;

    if (this.items) {
        for (var key in this.items) {
            this.totalQty += this.items[key].qty;
            this.totalPrice += this.items[key].qty * this.items[key].item.price;
        }
    }


    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item,qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.price;
    };

    this.reduce =function(id){
        this.items[id].qty--;
        this.items[id].price -=this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -=this.items[id].item.price;

        if(this.items[id].qty <=0){
            delete this.items[id];
        }
    };
    this.removeAll =function(id){
        this.totalQty-=this.items[id].qty;
        this.totalPrice -=this.items[id].price;
        delete this.items[id];

    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};

