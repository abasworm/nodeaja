const express = require('express');
const router = express.Router();

const Todo = require('../../models/todos');

router
	.get('/', (req,res,next)=>{
		Todo.findAsync({})
			.then((todos)=>{
				res.json(todos);
			})
			.catch(next)
			.error(console.error);
	})
	.get('/:id', (req,res,next)=>{
		Todo.findOneAsync({_id: req.params.id}, {text:1,done:1})
			.then((todos)=>{
				res.json(todos);
			})
			.catch(next)
			.error(console.error);
	})
	.post('/', (req,res,next)=>{
		const todo = new Todo();
		todo.text = req.body.text;
		todo.saveAsync()
			.then((todo)=>{
				console.log('success');
				res.json({
					'status' : 'success',
					'todo' : todo
				});
			})
			.catch((e)=>{
				console.log('fail');
				res.json({
					'status' : 'error',
					'error' : e
				})
			})
			.error(console.error);
	})
	.put('/:id',(req,res,next)=>{
		var todo = {};
		var prop;
		for(prop in req.body){
			todo[prop] = req.body[prop];
			console.log(todo);
		}
		Todo.updateAsync({_id:req.params.id},todo)
			.then((updatedTodo)=>{
				res.json({
					'status' : 'success',
					'todo' : updatedTodo
				});
			})
			.catch((e)=>{
				res.json({
					'status' : 'error',
					'error' : e
				})
			})
			.error(console.error);
	})
	;

module.exports = router;