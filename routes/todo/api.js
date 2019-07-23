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
		if(!req.body) return res.sendStatus(400);
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
			return res.send(400)
			.json({
				'status' : 'error',
				'error' : e
			})
		})
		.error(console.error);
	})

	.put('/:id',(req,res,next)=>{
		var todo = {};
		var prop;
		if(!req.body) return res.sendStatus(400);
		for(prop in req.body){
			todo[prop] = req.body[prop];
		}
		Todo.updateAsync({_id:req.params.id},todo)
		.then((updatedTodo)=>{
			res.json({
				'status' : 'success',
				'todo' : updatedTodo
			});
		})
		.catch((e)=>{
			return res.send(400)
			.json({
				'status' : 'error',
				'error' : e
			})
		})
		;
	})

	.delete('/:id',(req,res,next)=>{
		Todo.findByIdAndRemoveAsync(req.params.id)
		.then((deleteTodo)=>{
			res.json({
				'status' : 'success',
				'todo' : deleteTodo
			});
		})
		.catch((e)=>{
			return res.send(400)
			.json({
				'status' : 'fail',
				'error' : e
			})
		});
		
	})
	;

module.exports = router;