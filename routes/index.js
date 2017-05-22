var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg= req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Food Ordering App', products: productChunks,successMsg:successMsg,noMsg:!successMsg});
    });
});

router.get('/add-to-cart/:id/:fromCart', function (req, res, next) {
    console.log(req.params);
    var productId = req.params.id;
    var fromCart=req.params.fromCart;
    console.log(fromCart);
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        console.log(product);
        if(err){
            console.log("Inside error::"+err);
            return res.redirect('/');
        }
        cart.add(product, product.id);
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
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduce(productId);
    req.session.cart = cart;
    res.redirect('/cart');

});

router.get('/removeAll/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
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
        if (typeof req.session.cart === 'undefined' || !req.session.cart) {
            console.log("Inside undefined");
            res.render('shop/cart',{cartItems:null,title: 'Food Ordering App', products: productChunks});
        }else{
            console.log(req.session.cart);
            var cart = new Cart(req.session.cart)
            res.render('shop/cart', {cartItems:cart.generateArray(),totalPrice:cart.totalPrice,title: 'Food Ordering App', products: productChunks});

        }
    });

});

router.get('/checkout',isLoggedIn,function (req,res,next) {
    if(!req.session.cart){
        res.redirect('shop/cart');
    }
    var cart = new Cart(req.session.cart)
    var errorMsg = req.flash('error')[0];
    res.render('shop/checkout',{errorMsg:errorMsg,noError:!errorMsg,total:cart.totalPrice});
});

router.post('/checkout',isLoggedIn,function (req,res,next){
    if(!req.session.cart){
        res.redirect('shop/cart');
    }
    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")("sk_test_ThwMu7H7gpX8lWxRax70EEBd");
    var token = req.body.stripeToken;
    var charge = stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "INR",
        description: "Test Charge",
        source: token,
    }, function(err, charge) {
       if(err){
           console.log(err.message);
           req.flash('error',err.message);
           return res.redirect('/checkout');
       }

       var order =new Order({
           user: req.user,
           cart: cart,
           name:"dummy name",
           address:"address",
           paymentId:charge.id
       });

       order.save(function(err,result){
           if(err){
               console.log(err.message);
               req.flash('error',err.message);
               return res.redirect('/checkout');
           }
           req.flash('success',"Successfully placed order!");
           req.session.cart = null;
           res.redirect('/');
       });

    });

});


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}


module.exports = router;