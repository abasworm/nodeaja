var express = require('express');
var router = express.Router();
var todoModels = require('../models/todos');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render(
	  	'todo', 
	  	{ 
	  		title: 'todo app',
	  		todos : todoModels 
	  	}
	);
});


module.exports = router;
