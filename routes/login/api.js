const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

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
				const auth_token =  await JWT.sign({_id:resultset._id, fullname:resultset.fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

				if(validPassword){

					//session add
					req.session._id = resultset._id;
					req.session.username = resultset.username;
					req.session.fullname = resultset.fullname;
					req.session.token = auth_token;

					//result
					res
					.header('auth_token', auth_token)
					.json({
						'status' : 'success',
						'message' : 'login success',	
						'token' : auth_token
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
	})
	.get('/out',(req,res,next)=>{
		req.session.destroy((err)=>{
			if(err) return res.send(505);
			res.json({
				'status' : 'success',
				'message': 'Sukses Logout'
			});
		})
	});


module.exports = router;