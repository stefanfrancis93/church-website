var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var IncomeExpenditure  = require('../models/IncomeExpenditure');
var handleError = require('../helpers/handleError');

/* GET Detail page. */
router.get('/', function(req, res, next) {
	var pageSize = req.query.pageSize != null ? Number(req.query.pageSize) : 5;
	var pageNum = req.query.pageNum != null ? Number(req.query.pageNum) : 1;
	var skips = pageSize * (pageNum - 1);
	if (req.query.pageNum == null) {
		var total = IncomeExpenditure.find().count();
		IncomeExpenditure.find().skip(skips).limit(pageSize).sort({_id: -1}).exec(function(err, table) {
	    if (err) return handleError(err);
	    table.total = total;
			res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: "", total: total });
		});
	} else {
		var total = IncomeExpenditure.find().count();
		IncomeExpenditure.find().skip(skips).limit(pageSize).sort({_id: -1}).exec(function(err, table) {
	    if (err) return handleError(err);
	    table.total = total;
			res.json(table);
		});
	}
});

/* GET Detail page. */
router.get('/search/:value?', function(req, res, next) {
	req.params.value = req.params.value == undefined ? "" : req.params.value;
	console.log(req.params.value);
  IncomeExpenditure.find({details: {$regex : req.params.value} }).sort({_id: -1}).limit(5).exec(function (err, table) {
    if (err) return handleError(err);
	  res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: req.params.value });
  });
});

module.exports = router;
