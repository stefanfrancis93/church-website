//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    a_string: String,
    a_date: Date
});

var SomeModel = mongoose.model('SomeModel', SomeModelSchema );

module.exports = SomeModel;