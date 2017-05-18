var Product = require('../models/product');
var dbConfig = require('../config/db')

var mongoose = require('mongoose');

mongoose.connect(dbConfig.url);

var products = [
    new Product({
        imagePath: 'http://www.vegkitchen.com/wp-content/uploads/2011/12/Fruit-and-yogurt-parfait.jpg',
        title: 'Yogurt Fruit Parfait',
        description: 'Yogurt, Seasonal Fruits, Walnuts',
        extraDescription:'Veg World Cuisine',
        price: 50
    }),
    new Product({
        imagePath: 'http://www.annapurnaz.in/wp-content/uploads/2015/12/182.jpg',
        title: 'Chinese grilled sandwich',
        description: 'Vegetables, Chinese, Cheese, Sandwich Bread',
        extraDescription:'Veg Indian-inspired',
        price: 120
    }),
    new Product({
        imagePath: 'http://www.madeinmelskitchen.com/wp-content/uploads/2008/05/img_1983.jpg',
        title: 'Death By Chocolate',
        description: 'Dark Chocolate Ganache, Brownie',
        extraDescription:'Contains Egg World Cuisine',
        price: 200
    }),
    new Product({
        imagePath: 'https://normalcooking.files.wordpress.com/2012/07/chicken-ranch-club-wraps.jpg',
        title: 'Falafel Tzatziki Wrap',
        description: 'Tortilla,Assorted Peppers, Tzatziki Spread',
        extraDescription:'Veg Mediterranean',
        price: 150
    }),
    new Product({
        imagePath: 'https://www.whatsuplife.in/kolkata/blog/wp-content/uploads/2016/02/kol.jpg',
        title: 'Chicken Biryani',
        description: 'Basmati Rice ,Chicken,Whole spices',
        extraDescription:'Non Veg Indian-inspired',
        price: 350
    }),
    new Product({
        imagePath: 'http://www.chickmunks.com/wp-content/uploads/2016/08/garlic-Noodles.jpg',
        title: 'Garlic Chicken Hakka Noodle',
        description: 'Stir Fried Chicken, Hot Garlic Sauce, Hakka Noodles',
        extraDescription:'Non Veg Pan-Asian',
        price: 250
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}