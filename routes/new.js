var express = require('express');
var router = express.Router();
var Author  = require('../models/Author');
var Story  = require('../models/Story');
var handleError = require('../helpers/handleError');

/* GET Detail page. */
router.get('/', function(req, res, next) {

	var bob = new Author({ name: 'Bob Smith' });

	bob.save(function (err) {
	  if (err) return handleError(err);

	  //Bob now exists, so lets create a story
	  var story = new Story({
	    title: "Bob goes sledding",
	    author: bob._id    // assign the _id from the our author Bob. This ID is created by default!
	  });

	  story.save(function (err) {
	    if (err) return handleError(err);
	    // Bob now has his story
	  });
	});
	Story
	.findOne({ title: 'Bob goes sledding' })
	.populate('author') //This populates the author id with actual author information!
	.exec(function (err, story) {
	  if (err) return handleError(err);
	  res.send(story.author.name);
	  // prints "The author is Bob Smith"
	});
  // res.render('data', { title: 'User Data' });
});

module.exports = router;
