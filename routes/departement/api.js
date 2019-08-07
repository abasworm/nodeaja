const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const { isLogin, isAuth } = require('../../middleware/auth');

const sch = require('../../models/departement');
const JoiSchemaAdd = {
	departement_name : Joi.string().max(200).required(),
	departement_desc : Joi.string()
};
const JoiSchemaEdit = {
	id : Joi.string().required(),
	departement_name : Joi.string().max(200).required(),
	departement_desc : Joi.string() 
};
const fieldToShow = [
	'_id',
	'departement_name',
	'departement_desc'
];


router
	.get('/', isAuth, (req,res,next)=>{
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
			'departement_name' : req.body.departement_name,
			'departement_desc' : req.body.departement_desc
		}
		if(!req.body) return res.sendStatus(400);

		const salt = await bcrypt.genSalt(10);
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

	.put('/:id',async (req,res,next)=>{
		var fields = {};
		var prop;
		console.log(req.body);
		if(!req.body) return res.sendStatus(400);

		//update
		fields.id = req.params.id;
		fields.departement_name = req.body.departement_name;
		fields.departement_desc = req.body.departement_desc;


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