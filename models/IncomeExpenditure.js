//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var IncomeExpenditureSchema = Schema({
  date    			    : Date,
  voucher			      : String,
  details 			    : String,
  credit			      : Number,
  debit				      : Number,
  bank_credit_debit	: Number,
  cash_in_bank		  : Number,
  cash_in_hand		  : Number
},{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var IncomeExpenditure = mongoose.model('IncomeExpenditure', IncomeExpenditureSchema );

module.exports = IncomeExpenditure;