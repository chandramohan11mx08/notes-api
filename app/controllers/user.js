var mongoose = require('mongoose');
var User = require("../models/user");
var md5 = require('md5');
var validator = require('validator');
var async = require('async');

var connectionString = 'mongodb://localhost/notes';

function validateEmailAndPassword(email, password) {
    var isValidEmail = validator.isEmail(email);
    var isValidPassword = !validator.isNull(password);
    var messages = [];
    if (isValidEmail && isValidPassword) {
        return {'isValid': true};
    }
    if (!isValidEmail) {
        messages.push("Email is not valid");
    }
    if (!isValidPassword) {
        messages.push("Password is not valid");
    }
    return {'isValid': false, 'messages': messages};
}

function isEmailAllReadyExists(email, callBack) {
    User.find({'email': email}, function (err, users) {
        var exists = users.length > 0 ? true : false;
        callBack(err, exists);
    });
}

function saveUser(user, callBack) {
    user.save(function (err) {
        var saved = err ? false : true;
        callBack(saved);
    });
}

function getNewUser(email, password) {
    var newUser = new User({
        email: email,
        password: md5(password)
    });
    return newUser;
}

var registerUser = function (req, res, next) {
    var params = req.params;
    var email = params.email.trim();
    var password = params.password.trim();

    var __ret = validateEmailAndPassword(email, password);
    var db = mongoose.connect(connectionString);

    function sendResponse(status, messages) {
        if (db) {
            db.disconnect();
        }
        res.send({status: status, "messages": messages})
    }

    if (__ret.isValid) {

        isEmailAllReadyExists(email, function (err, isExists) {
            if (err)
                sendResponse(false, ["Something went wrong"]);

            else {
                if (isExists) {
                    sendResponse(false, ["Email address already exists"]);
                }
                else {
                    var newUser = getNewUser(email, password);
                    saveUser(newUser, function (isSaved) {
                        if (isSaved) {
                            sendResponse(true, []);
                        } else {
                            sendResponse(false, ["Something went wrong"]);
                        }
                    });
                }
            }
        });
    } else {
        sendResponse(false, __ret.messages);
    }
};

module.exports.registerUser = registerUser;