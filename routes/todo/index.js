var express = require('express');
var router = express.Router();
var Todo = require('../../models/todos');

/* GET home page. */
router.get('/', function(req, res, next) {

//with promise
	Todo.findAsync()
		.then((todos)=>{
			res.render('todo',{
	  			title: 'Todo',
	  			todos: todos
	  		});
		})
		.catch(next)
		.error(console.error);

//without promise
  // 	Todo.find((err,todos)=>{
  // 		if(err)return console.log(err);
  // 		res.render('todo',
	 //  		{
	 //  			title: 'Todo',
	 //  			todos: todos
	 //  		}
		// );
  // 	});
});

module.exports = router;
