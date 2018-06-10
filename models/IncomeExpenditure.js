//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var DataSchema = Schema({
  date    			: String,
  voucher			: Number,
  details 			: String,
  credit			: Number,
  debit				: Number,
  bank_credit_debit	: Number,
  cash_in_bank		: Number,
  cash_in_hand		: Number,
  updated_on		: Date
});

var IncomeExpenditure = mongoose.model('IncomeExpenditure', DataSchema );

module.exports = IncomeExpenditure;