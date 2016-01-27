var mongoose = require('mongoose');
var User = require("../models/user");
var md5 = require('md5');
var helper = require('../helpers/helper');
var config = require('../config');

var connectionString = config.mongodb;

function sendRegisterUserResponse(res, status, messages) {
    res.send({status: status, "messages": messages})
}

function getNewUser(email, password) {
    var newUser = new User({
        email: email,
        password: md5(password)
    });
    return newUser;
}

var isEmailAllReadyExists = function (req, res, next) {
    var email = req.params.email.trim();
    var db = mongoose.connect(connectionString);
    User.findOne({'email': email}, '_id email', function (err, user) {
        db.disconnect(function () {
            if (err) {
                sendRegisterUserResponse(res, false, ["Something went wrong"]);
            } else {
                if (user != null) {
                    sendRegisterUserResponse(res, false, ["Email address already exists"]);
                } else {
                    next();
                }
            }
        });
    });
}

var registerUser = function (req, res, next) {
    var params = req.params;
    var email = params.email.trim();
    var password = params.password.trim();

    var __ret = helper.validateEmailAndPassword(email, password);

    if (__ret.isValid) {
        var newUser = getNewUser(email, password);
        var db = mongoose.connect(connectionString);

        newUser.save(function (err) {
            db.disconnect(function () {
                var saved = err ? false : true;
                if (saved) {
                    sendRegisterUserResponse(res, true, []);
                } else {
                    sendRegisterUserResponse(res, false, ["Something went wrong"]);
                }
            });
        });
    } else {
        sendRegisterUserResponse(res, false, __ret.messages);
    }
};

var authenticationHandler = function (req, res, next) {
    var credentials = req.authorization.basic;
    var email = credentials.username;
    var password = md5(credentials.password);
    var db = mongoose.connect(connectionString);
    User.findOne({'email': email, 'password': password}, '_id email', function (err, user) {
        db.disconnect(function () {
            var authenticated = err || user == null ? false : true;
            if (authenticated) {
                next();
            } else {
                res.send(401, {'authenticated': false})
            }
        });
    });
};

exports.registerUser = registerUser;
exports.authenticationHandler = authenticationHandler;
exports.isEmailAllReadyExists = isEmailAllReadyExists;