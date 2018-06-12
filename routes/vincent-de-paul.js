var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var IncomeExpenditure  = require('../models/IncomeExpenditure');
var handleError = require('../helpers/handleError');

/* GET Detail page. */
router.get('/:page?', function(req, res, next) {
	var pageSize = req.params.pageSize != null ? Number(req.params.pageSize) : 5;
	var pageNum = req.params.page != null ? Number(req.params.page) : 1;
	var skips = pageSize * (pageNum - 1);
	var total;
	IncomeExpenditure.count(function(err, data){
		total = data;
		if (pageNum > total/pageSize + 1) {
			res.redirect("/vincent-de-paul");
			return;
		}
		IncomeExpenditure.find().skip(skips).limit(pageSize).sort({_id: -1}).exec(function(err, table) {
	    if (err) return handleError(err);
	    table.total = total;
			res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: "", total: total });
		});
	});
});

/* GET Detail page. */
router.get('/search/:value?/:page?', function(req, res, next) {
	var pageSize = req.query.pageSize != null ? Number(req.query.pageSize) : 5;
	var pageNum = req.query.page != null ? Number(req.query.page) : 1;
	var skips = pageSize * (pageNum - 1);
	req.params.value = req.params.value == undefined ? "" : req.params.value;
	var total;
	IncomeExpenditure.find({details: {$regex : req.params.value} }).count().exec(function(err, data){
		total = data;
	  IncomeExpenditure.find({details: {$regex : req.params.value} }).skip(skips).limit(pageSize).sort({_id: -1}).limit(5).exec(function (err, table) {
	    if (err) return handleError(err);
		  res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: req.params.value, total: total });
	  });
	});
});

router.get('/get_date_filter', function(req, res, next) {
  var data = {x: req.query.x, y: req.query.y}, total;
  var pageSize = req.query.pageSize != null ? Number(req.query.pageSize) : 5;
  var pageNum = req.query.pageNum != null ? Number(req.query.pageNum) : 1;
  var skips = pageSize * (pageNum - 1);
  IncomeExpenditure.find({
    date: {
        $gte: data.x,
        $lt: data.y
    }
  })
  .count(function(err, data){
    total = data;
    IncomeExpenditure.find({
      date: {
          $gte: data.x,
          $lt: data.y
      }
    })
    .skip(skips).limit(pageSize).sort({_id: -1}).exec(function(err, table) {
      if (err) return handleError(err);
      table.total = total;
      res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: "", total: total });
    });
  });


});

module.exports = router;
