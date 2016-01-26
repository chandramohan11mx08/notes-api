var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
