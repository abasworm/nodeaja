const JWT = require('jsonwebtoken');

module.exports = {
	isLogin: async (req,res,next) =>{
		try{
			let id = req.session._id;
			let username = req.session.username;
			let fullname = req.session.fullname;
			console.log(req.session);
			if(username){
				const auth_token =  await JWT.sign({id:id,fullname:fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
				req.session.token = auth_token;

				next();
			}else{
				res.redirect('/');
			}
		}catch(err){
			res
			.sendStatus(401);
			
		}
	},

	isAuth: async (req,res,next)=>{
		try{
			const token = req.headers.auth_token;
			console.log(token);
			let {err, decode} = await JWT.verify(token,process.env.TOKEN_SECRET_KEY);
			if(err) return res
				.sendStatus(401);
			next();
		}catch(err){
			res
			.sendStatus(401);
		}
	}

}