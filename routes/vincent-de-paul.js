var express = require('express');
var router = express.Router();
var IncomeExpenditure  = require('../models/IncomeExpenditure');
var handleError = require('../helpers/handleError');
var {DEFAULT_PAGE_SIZE} = require('../config');

var loadPage = function(req, res, next) {
	var pageSize = req.params.pageSize != null ? Number(req.params.pageSize) : DEFAULT_PAGE_SIZE;
	var pageNum = req.params.page != null ? Number(req.params.page) : 1;
	var sortBy = req.params.sortBy != null ? req.params.sortBy : "_id";
	var skips = pageSize * (pageNum - 1);
	var total, sort = {};
	sort[sortBy] = -1;
	console.log(req.params);
	IncomeExpenditure.countDocuments(function(err, data){
		total = data;
		if (pageNum > total/pageSize + 1) {
			res.redirect("/vincent-de-paul");
			return;
		}
		IncomeExpenditure.find().skip(skips).limit(pageSize).sort(sort).exec(function(err, table) {
			if (err) return handleError(err);
			table.total = total;
			res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: "", total: total });
		});
	});
}

var searchPage = function(req, res, next) {
	var pageSize = req.query.pageSize != null ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE;
	var pageNum = req.query.page != null ? Number(req.query.page) : 1;
	var sortBy = req.params.sortBy != null ? req.params.sortBy : "_id";
	var skips = pageSize * (pageNum - 1);
	req.params.value = req.params.value == undefined ? "" : req.params.value;
	var total, sort = {};
	sort[sortBy] = -1;
	IncomeExpenditure.find({details: {$regex : req.params.value} }).countDocuments().exec(function(err, data){
		total = data;
	  IncomeExpenditure.find({details: {$regex : req.params.value} }).skip(skips).limit(pageSize).sort(sort).limit(DEFAULT_PAGE_SIZE).exec(function (err, table) {
	    if (err) return handleError(err);
		  res.render('vincent-de-paul', { title: 'Society of Saint Vincent de Paul', data: table, searchQuery: req.params.value, total: total });
	  });
	});
}

var dateFilterPage = function(req, res, next) {
  var data = {x: req.query.x, y: req.query.y}, total;
  var pageSize = req.query.pageSize != null ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE;
  var pageNum = req.query.pageNum != null ? Number(req.query.pageNum) : 1;
  var skips = pageSize * (pageNum - 1);
  IncomeExpenditure.find({
    date: {
        $gte: data.x,
        $lt: data.y
    }
  })
  .countDocuments(function(err, data){
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


}

/* GET Detail page. */
router.get('/', loadPage);
router.get('/page=:page?', loadPage);
router.get('/sortBy=:sortBy/page=:page', loadPage);

/* GET Search page. */
router.get('/search=:value&page=:page', searchPage);
router.get('/sortBy=:sortBy&search=:value&page=:page', searchPage);

/* GET Date Filter page. */
router.get('/get_date_filter/:x?/:y?', dateFilterPage);
router.get('/get_date_filter/sortBy=:sortBy?/:x?&:y?', dateFilterPage);

module.exports = router;
