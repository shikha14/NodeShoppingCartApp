var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Product = require('../models/product');

router.get('/', function (req, res, next) {

    Product.find(function (err, products) {
        if (err)
            res.send(err);

        res.json(products);
    });
});

router.get('/addProduct', function (req, res, next) {
    res.render('product/add');
});

module.exports = router;