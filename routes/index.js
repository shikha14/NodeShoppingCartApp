var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Cart = require('../models/cart');
var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Food Ordering App', products: productChunks});
    });
});

router.get('/add-to-cart/:id/:fromCart', function (req, res, next) {
    console.log(req.params);
    var productId = req.params.id;
    var fromCart=req.params.fromCart;
    console.log(fromCart);
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});

    Product.findById(productId, function (err, product) {
        console.log(product);
        if(err){
            console.log("Inside error::"+err);
            return res.redirect('/');
        }
        cart.add(product, product._id);
        req.session.cart = cart;
        // console.log(req.session.cart);

        if (fromCart === 'true'){
            res.redirect('/cart');
        }else{
            res.redirect('/');
        }

    });
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});
    cart.reduce(productId);
    req.session.cart = cart;
    res.redirect('/cart');

});

router.get('/removeAll/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});
    cart.removeAll(productId);
    req.session.cart = cart;
    res.redirect('/cart');

});

router.get('/cart',function (req,res,next) {
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        if (typeof req.session.cart === 'undefined') {
            console.log("Inside undefined");
            res.render('shop/cart',{cartItems:null,title: 'Food Ordering App', products: productChunks});
        }else{
            console.log(req.session.cart);
            var cart = new Cart(req.session.cart.items)
            res.render('shop/cart', {cartItems:cart.generateArray(),totalPrice:cart.totalPrice,title: 'Food Ordering App', products: productChunks});

        }
    });

});
// router.get('/checkout',function (req,res,next) {
//     if(!req.session.cart){
//         res.redirect('shop/cart');
//     }
//     var cart = new Cart(req.session.cart.items)
//     res.render('shop/checkout',{total:cart.totalPrice});
// });


router.get('/checkout',function (req,res,next) {
    res.render('shop/checkout');
});


module.exports = router;