var mongoose = require('mongoose');
var User = require("../models/user");
var md5 = require('md5');
var helper = require('../helpers/helper');

var connectionString = 'mongodb://localhost/notes';

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

    var __ret = helper.validateEmailAndPassword(email, password);
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

var authenticateUser = function(req, res, next){
    var params = req.params;
    var email = params.email;
    var password = md5(params.password);
    var db = mongoose.connect(connectionString);
    User.findOne({'email':email, 'password': password},'_id email' ,function(err, user){
        db.disconnect();
        var authenticated = err || user == null ? false : true;
        res.send({'authenticated':authenticated,'user':user})
    });
};

module.exports.registerUser = registerUser;
module.exports.authenticateUser = authenticateUser;