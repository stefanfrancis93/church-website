var express = require('express');
var router = express.Router();
var SomeModel  = require('../models/someModel');

/* GET Detail page. */
router.get('/', function(req, res, next) {
	SomeModel.find(function (err, data) {
	  if (err) return handleError(err);
	  res.json(data);
	})
  // res.render('data', { title: 'User Data' });
});

module.exports = router;
