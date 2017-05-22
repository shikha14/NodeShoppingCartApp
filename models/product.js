var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;


var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    extraDescription: {type: String, required: false},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', schema);