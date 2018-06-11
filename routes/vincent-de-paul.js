var express = require('express');
var router = express.Router();
var IncomeExpenditure  = require('../models/IncomeExpenditure');
var handleError = require('../helpers/handleError');

/* GET Detail page. */
router.get('/', function(req, res, next) {
  IncomeExpenditure.find().sort({updated_on: -1}).exec(function (err, table) {
    if (err) return handleError(err);
	  res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: "" });
  });
});

/* GET Detail page. */
router.get('/search/:value', function(req, res, next) {
	console.log(req.params.value);
  IncomeExpenditure.find({details: {$regex : req.params.value} }).sort({updated_on: -1}).exec(function (err, table) {
    if (err) return handleError(err);
	  res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: req.params.value });
  });
});

module.exports = router;
