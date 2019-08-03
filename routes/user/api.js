const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const sch = require('../../models/users');
const JoiSchemaAdd = {
	username : Joi.string().min(6).max(20).required(),
	password : Joi.string().min(6).max(20).required(),
	confpassword : Joi.string().min(6).max(20).required().valid(Joi.ref('password')),
	fullname : Joi.string().min(4).max(30).required()
};
const JoiSchemaEdit = {
	id : Joi.string().required(),
	username : Joi.string().min(6).max(20).required(),
	fullname : Joi.string().min(4).max(30).required()
};
const fieldToShow = [
	'_id',
	'username',
	'password',
	'fullname'
];


router
	.get('/', (req,res,next)=>{
		sch.findAsync({})
			.then((resultset)=>{
				var rs = [];
				for(var i in resultset){
					var xobj = {};
					for(var x in fieldToShow){
						console.log(resultset[i][fieldToShow[x]]);
						xobj[fieldToShow[x]] = resultset[i][fieldToShow[x]];
					}
					rs.push(xobj);
				}
				res.json({
					//'status' : true,
					'data' : rs,

				});
			})
			.catch(next)
			.error(console.error);
	})

	.get('/:id', (req,res,next)=>{
		sch.findOneAsync({_id: req.params.id})
			.then((resultset)=>{
				
				var xobj = {};
				for(var x in fieldToShow){
					
					xobj[fieldToShow[x]] = resultset[fieldToShow[x]];
				}
				res.json({
					'status' : 'success',
					'result' : xobj
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

	.post('/', async (req,res,next)=>{
		const newData = new sch();
		const fields = {
			'username' : req.body.username,
			'password' : req.body.password,
			'fullname' : req.body.fullname
		}
		if(!req.body) return res.sendStatus(400);

		const salt = await bcrypt.genSalt(10);
		const pwd = await bcrypt.hash(req.body.password,salt);
		Object.assign(newData,fields);

		fields.confpassword = req.body.confpassword;
		newData.password = pwd;

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

	.put('/:id',async (req,res,next)=>{
		var fields = {};
		var prop;
		console.log(req.body);
		if(!req.body) return res.sendStatus(400);

		//update
		fields.id = req.params.id;
		fields.username = req.body.username;
		
		if(req.body.password){
			
			fields.password = req.body.password;
			fields.confpassword = req.body.confpassword;
			JoiSchemaEdit.password = Joi.string().min(6).max(20).required();
			JoiSchemaEdit.confpassword = Joi.string().min(6).max(20).required().valid(Joi.ref('password'));
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

		if(req.body.password){
			const salt = await bcrypt.genSalt(10);
			const pwd = await bcrypt.hash(req.body.password,salt);
			fields.password = pwd;	
			delete fields.confpassword;
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