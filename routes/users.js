var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile',isLoggedIn, function (req, res, next) {
    Order.find({user:req.user},function (err,orders) {
        if(err){
            return res.write("Error!")
        }
        var cart;
        orders.forEach(function (order) {
                cart =new Cart(order.cart);
                order.items= cart.generateArray();
                var orderDateTime = new Date(order.createdAt)  ;
                orderDateTime = orderDateTime.toDateString() + " " + orderDateTime.getHours() + ":"+ orderDateTime.getMinutes();
                order.dateTime=orderDateTime;
                console.log("orderDateTime::"+orderDateTime);

        });
        console.log(orders.length);
        res.render('user/profile',{orders:orders,hasOrder:orders.length>0});
    });

});

router.get('/logout',isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});


router.use('/',notLoggedIn,function (req,res,next) {
    next();
});


router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});



router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin',{
    failureRedirect: 'signin',
    failureFlash: true
}),function (req, res, next) {
    if(req.session.oldUrl){
        var oldUrl=req.session.oldUrl;
        console.log("oldurl"+oldUrl)
        req.session.oldUrl=null;
        res.redirect(oldUrl);

    }else{
        res.redirect('/user/profile')
    }
});

router.post('/signup', passport.authenticate('local.signup',{
    failureRedirect: 'signup',
    failureFlash: true
}),function (req, res, next) {
    if(req.session.oldUrl){
        var oldUrl=req.session.oldUrl;
        console.log("oldurl"+oldUrl)
        req.session.oldUrl=null;
        res.redirect(oldUrl);
    }else{
        res.redirect('/user/profile');
    }
});

module.exports = router;


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req,res,next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}