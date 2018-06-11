var express = require('express');
var router = express.Router();
var IncomeExpenditure  = require('../models/IncomeExpenditure');
var handleError = require('../helpers/handleError');

/* GET users listing. */
router.post('/', function(req, res, next) {
  var data = {};
  var date1 = req.body.date.split('-'),
    x = new Date(date1[0], date1[1]-1).getTime();
  data.date = x;
  data.voucher = Number(req.body.voucher);
  data.details = req.body.details;
  data.credit = Number(req.body.credit);
  data.debit = Number(req.body.debit);
  data.bank_credit_debit = Number(req.body.bank_credit_debit);
  data.cash_in_bank = Number(req.body.cash_in_bank);
  data.cash_in_hand = Number(req.body.cash_in_hand);
  data.updated_on = new Date();
  var row = new IncomeExpenditure(data);
  row.save(function (err, document) {
    if (err) return handleError(err);
    res.json(document);
  });
});

module.exports = router;
