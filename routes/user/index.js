const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { isLogin, isAuth } = require('../../middleware/auth');

const _layout = {
	title : 'User Management'
};

router
	.get('/', isLogin, (req,res,next)=>{
		_layout.token = req.session.token;

		res
		.render('user/index',_layout);
	})

	.get('/add',isLogin, (req,res,next)=>{
		_layout.token = req.session.token;
		const _Add = {
			title : 'Add User',
			isAddForm : true
		}
		_data = {..._layout, ..._Add};
		res.render('user/add',_data);
	})

	.get('/edit/:id',isLogin, (req,res,next)=>{
		_layout.token = req.session.token;
		const _Edit = {
			title : 'Edit User',
			isAddForm : false,
			ids : req.params.id
		}
		_data = {..._layout, ..._Edit};
		res.render('user/add',_data);
	})
;

module.exports = router;