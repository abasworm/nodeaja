const express = require('express');
const router = express.Router();

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
;

module.exports = router;