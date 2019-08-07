const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

const DepartementSchema = new Schema({
	departement_name : {type:'String', max:200, required:true, unique:true, dropDups: true},
	departement_desc: {type:'String', required:true},
	created_date : {type:'String', required:true, default:Date.now},
	is_active: {type:'Boolean', default:false}
}); 

const Departement = mongoose.model('Departement',DepartementSchema);

module.exports = Departement;