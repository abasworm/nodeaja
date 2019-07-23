const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

const UserSchema = new Schema({
	username : {type:'String', min:6, max:20, required:true, unique:true, dropDups: true},
	password : {type:'String', required:true},
	fullname : {type:'String', required:true},
	created_date : {type:'String', required:true, default:Date.now},
	last_login : {type:'String'},
	is_active: {type:'Boolean', default:false}
	
}); 

const User = mongoose.model('User',UserSchema);

module.exports = User;