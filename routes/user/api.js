const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const sch = require('../../models/users');
const JoiSchemaAdd = {
	username : Joi.string().min(6).max(20).required(),
	password : Joi.string().min(6).max(20).required(),
	fullname : Joi.string().min(4).max(30).required()
}
const JoiSchemaEdit = {
	id : Joi.string().required(),
	username : Joi.string().min(6).max(20).required(),
	fullname : Joi.string().min(4).max(30).required()
}


router
	.get('/', (req,res,next)=>{
		sch.findAsync({})
			.then((resultset)=>{
				res.json({
					//'status' : true,
					'data' : resultset
				});
			})
			.catch(next)
			.error(console.error);
	})

	.get('/:id', (req,res,next)=>{
		sch.findOneAsync({_id: req.params.id})
			.then((resultset)=>{
				res.json({
					'status' : 'success',
					'result' : resultset
				});
			})
			.catch((e)=>{
				return res
				.json({
					'status' : 'error',
					'message': e.message
				});
			})
			.error(console.error);
	})

	.post('/', (req,res,next)=>{
		const newData = new sch();
		const fields = {
			'username' : req.body.username,
			'password' : req.body.password,
			'fullname' : req.body.fullname
		}
		if(!req.body) return res.sendStatus(400);

		Object.assign(newData,fields);

		const { error, value} = Joi.validate(fields, JoiSchemaAdd);
		if(error!==null){
			const message = error.details[0].message;
			const value = error.details[0].path[0];
			return res
				.json({
					'status' : 'error',
					'message': message
			});
		}

		newData.saveAsync()
		.then((resultset)=>{
			//console.log('success');
			res.json({
				'status' : 'success',
				'result' : resultset
			});
		})
		.catch((e)=>{
			//console.log('fail');
			res.json({
				'status' : 'error',
				'message' : e.errmsg
			});
		})
		.error(console.error);
	})

	.put('/:id',(req,res,next)=>{
		var fields = {};
		var prop;
		console.log(req.body);
		if(!req.body) return res.sendStatus(400);

		//update
		fields.id = req.params.id;
		fields.username = req.body.username;
		if(req.body.password){
			fields.password = req.body.password;
			JoiSchemaEdit.password = Joi.string().min(6).max(20).required();
		}
		fields.fullname = req.body.fullname;

		//validate
		const { error, value} = Joi.validate(fields, JoiSchemaEdit);
		if(error!==null){
			const message = error.details[0].message;
			const value = error.details[0].path[0];
			return res
				.json({
					'status' : 'error',
					'message': message
			});
		}

		delete fields.id;

		sch.updateAsync({_id:req.params.id},fields)
		.then((updatedResult)=>{
			res.json({
				'status' : 'success',
				'result' : updatedResult
			});
		})
		.catch((e)=>{
			return res
			.json({
				'status' : 'error',
				'message' : e.message
			})
		})
		;
	})

	.delete('/:id',(req,res,next)=>{
		sch.findByIdAndRemoveAsync(req.params.id)
		.then((deleteTodo)=>{
			res.json({
				'status' : 'success',
				'todo' : deleteTodo
			});
		})
		.catch((e)=>{
			return res
			.json({
				'status' : 'fail',
				'error' : e
			})
		});
		
	})
	;

module.exports = router;