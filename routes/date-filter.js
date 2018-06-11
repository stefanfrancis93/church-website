var express = require('express');
var router = express.Router();
var IncomeExpenditure  = require('../models/IncomeExpenditure');
var handleError = require('../helpers/handleError');

/* GET users listing. */
router.post('/', function(req, res, next) {
  var data = req.body;
  console.log(data);
  IncomeExpenditure.find({
    date: {
        $gte: data.x,
        $lt: data.y
    }
  },function (err, document) {
    if (err) return handleError(err);
    res.json(document);
  });
});

module.exports = router;
