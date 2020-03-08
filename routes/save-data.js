var express = require("express");
var router = express.Router();
var IncomeExpenditure = require("../models/IncomeExpenditure");
var Balance = require("../models/Balance");
var handleError = require("../helpers/handleError");

/* GET users listing. */
router.post("/", async function(req, res, next) {
  var data = {};
  var date1 = req.body.date.split("/"),
    x = new Date(date1[2], date1[0], date1[1]).getTime(),
    lastRecord = {};
  data.date = x;
  data.voucher = req.body.voucher;
  data.details = req.body.details;
  data.credit = Number(req.body.credit);
  data.debit = Number(req.body.debit);
  data.bank_credit_debit = Number(req.body.bank_credit_debit);
  // [lastRecord] = await IncomeExpenditure.find().sort({"createdAt": -1}).limit(1);
  [lastRecord] = await Balance.find();
  if (!lastRecord) {
    lastRecord = {
      cash_in_hand: 0,
      cash_in_bank: 0
    };
  }
  console.log(lastRecord);
  if (Number(req.body.bank_credit_debit) === 0) {
    if (Number(req.body.credit) !== 0) {
      data.cash_in_hand =
        Number(lastRecord.cash_in_hand || 0) + Number(req.body.credit);
      data.cash_in_bank = Number(lastRecord.cash_in_bank || 0);
    } else {
      data.cash_in_hand =
        Number(lastRecord.cash_in_hand || 0) - Number(req.body.debit);
      data.cash_in_bank = Number(lastRecord.cash_in_bank || 0);
    }
  } else {
    if (Number(req.body.credit) !== 0) {
      data.cash_in_bank =
        Number(lastRecord.cash_in_bank || 0) + Number(req.body.credit);
      data.cash_in_hand = Number(lastRecord.cash_in_hand || 0);
    } else {
      data.cash_in_bank =
        Number(lastRecord.cash_in_bank || 0) - Number(req.body.debit);
      data.cash_in_hand = Number(lastRecord.cash_in_hand || 0);
    }
  }
  console.log(data);
  const { _id } = lastRecord,
    newBalance = {
      cash_in_bank: data.cash_in_bank,
      cash_in_hand: data.cash_in_hand
    };
  Balance.findOneAndUpdate({ _id }, newBalance, {new: true}, function(err, document) {
    if (err) {
      next(err);
    }
    console.log(document);
    var row = new IncomeExpenditure(data);
    row.save(function(err, newDoc) {
      if (err) return handleError(err);
      res.json(newDoc);
    });
  });
});

module.exports = router;
