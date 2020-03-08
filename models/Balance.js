//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var BalanceSchema = Schema({
  cash_in_bank		  : Number,
  cash_in_hand		  : Number
},{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Balance = mongoose.model('Balance', BalanceSchema );

module.exports = Balance;