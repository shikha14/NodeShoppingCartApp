var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Product = require('../models/product');

router.get('/', function (req, res, next) {
    res.render('product/add');
    // var successMsg= req.flash('success')[0];
    // Product.find(function (err, docs) {
    //     var productChunks = [];
    //     var chunkSize = 3;
    //     for (var i = 0; i < docs.length; i += chunkSize) {
    //         productChunks.push(docs.slice(i, i + chunkSize));
    //     }
    //     res.render('product/add', {title: 'Food Ordering App', products: productChunks});
    // });
});

router.get('/addProduct', function (req, res, next) {
    res.render('product/add');
});

module.exports = router;