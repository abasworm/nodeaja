const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

const TodoSchema = new Schema({
	text: {type:'String', require:true},
	done: {type:'Boolean'}
}); 

const Todo = mongoose.model('Todo',TodoSchema);

module.exports = Todo;