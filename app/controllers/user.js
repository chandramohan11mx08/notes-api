var mongoose = require('mongoose');
var User = require("../models/user");
var md5 = require('md5');

var connectionString = 'mongodb://localhost/notes';

var registerUser = function (req, res, next) {
    var params = req.params;
    var newUser = new User({
        email: params.email,
        password: md5(params.password)
    });
    res.send(newUser);

    var db = mongoose.connect(connectionString);
    newUser.save(function (err) {
        db.disconnect();
        if (err) {
            res.send({'saved': false});
            return;
        }
        res.send({'saved': true});
    });
};

module.exports.registerUser = registerUser;