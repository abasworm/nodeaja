const mongoose = require('mongoose');

const dbConString = process.env.MONGODB_URI || 'mongodb://localhost:27017';
module.exports = mongoose.connect(dbConString + '/todos');