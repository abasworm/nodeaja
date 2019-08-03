const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const sch = require('../../models/users');
const JoiSchemaLogin = {
	username : Joi.string().min(6).max(20).required(),
	password : Joi.string().min(6).max(20).required()
};

router
	.get('/',(req,res,next)=>{
		res.returnStatus(404);
	})
	.post('/check',(req,res,next)=>{
		const newData = new sch();
		const fields = {
			'username' : req.body.username,
			'password' : req.body.password
		}
		if(!req.body) return res.sendStatus(400);
		const { error, value} = Joi.validate(fields, JoiSchemaLogin);
		if(error!==null){
			const message = error.details[0].message;
			const value = error.details[0].path[0];
			return res
				.json({
					'status' : 'error',
					'message': message
			});
		}else{
			sch.findOneAsync({username: fields.username})
			.then(async (resultset)=>{
				if(!resultset) return res.json({
						'status' : 'error',
						'result' : 'Password / Username is Invalid'
					});
				const validPassword = await bcrypt.compare(fields.password, resultset.password);

				if(validPassword){
					res.json({
						'status' : 'success',
						'message' : 'login success',
					});	
				}else{
					return res.json({
						'status' : 'error',
						'message' : 'Password / Username is Invalid'
					});
				}

				
			})
			.catch((e)=>{
				return res
				.json({
					'status' : 'error',
					'message': e.message
				});
			})
			.error(console.error);
		}
	});


module.exports = router;