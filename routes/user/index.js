const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const _layout = {
	title : 'User Management'
};

router
	.get('/',(req,res,next)=>{
		res.render('user/index',_layout);
	})

	.get('/add',(req,res,next)=>{
		const _Add = {
			title : 'Add User',
			isAddForm : true
		}
		_data = {..._layout, ..._Add};
		res.render('user/add',_data);
	})

	.get('/edit/:id',(req,res,next)=>{
		const _Edit = {
			title : 'Edit User',
			isAddForm : false,
			ids : req.params.id
		}
		_data = {..._layout, ..._Edit};
		res.render('user/add',_data);
	})

	.get('/test',async (req,res,next)=>{
		const salt = await bcrypt.genSalt(10);
		const pwd = await bcrypt.hash('helloworld',salt);
		res.send('hello '+ pwd);
		
	});
;

module.exports = router;