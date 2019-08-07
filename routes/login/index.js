const router = require('express').Router();
const bcrypt = require('bcryptjs');

const _layout = {
	title : 'Login'
};

router
	.get('/',(req,res,next)=>{
		res.render('login/index',_layout);
	});

module.exports = router;