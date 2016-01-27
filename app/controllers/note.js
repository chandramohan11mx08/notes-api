var mongoose = require('mongoose');
var Note = require("../models/note");
var helper = require("../helpers/helper");
var config = require('../config');

var connectionString = config.mongodb;

function getNewNote(email, title, description) {
    var newNote = new Note({
        title: title,
        description: description,
        email: email
    });
    return newNote;
}

var isTitleAlreadyExistsForUser = function (req, res, next) {
    var params = req.params;
    var title = params.title.trim();
    var credentials = req.authorization.basic;
    var email = credentials.username;

    var db = mongoose.connect(connectionString);
    Note.findOne({'email': email, 'title': title,'isDeleted':false}, function (err, note) {
        db.disconnect(function () {
            var isExists = (note == null) ? false : true;
            if (isExists) {
                res.send({'isCreated': false, 'messages': ["You already have a note with same title "]});
            } else {
                next();
            }
        });
    });
}

var createNote = function (req, res, next) {
    var params = req.params;
    var title = params.title.trim();
    var description = params.description.trim();

    var validationResult = helper.validateTitleAndDescription(title, description);
    if (validationResult.isValid) {
        var credentials = req.authorization.basic;
        var email = credentials.username;
        var newNote = getNewNote(email, title, description);

        var db = mongoose.connect(connectionString);
        newNote.save(function (err) {
            db.disconnect();
            var isSaved = err ? false : true;
            sendResponse(isSaved, []);
        });
    } else {
        sendResponse(false, validationResult.messages);
    }

    function sendResponse(isCreated, messages) {
        res.send({'isCreated': isCreated, 'messages': messages});
    }
};

var listNotes = function (req, res, next) {
    var credentials = req.authorization.basic;
    var email = credentials.username;
    var db = mongoose.connect(connectionString);
    Note.find({'email': email, 'isDeleted': false}, 'title description createdAt modifiedAt meta', function (err, notes) {
        db.disconnect(function () {
            if (err) {
                res.send(500, {messages: 'Something went wrong'});
            } else {
                res.send({'notes': notes});
            }
        });
    });
}

var updateNote = function (req, res, next) {
    var credentials = req.authorization.basic;
    var email = credentials.username;
    var params = req.params;
    var noteId = params.noteId;
    var description = params.description;
    var db = mongoose.connect(connectionString);

    function sendUpdateResponse(status, messages, errorCode) {
        if (db) {
            db.disconnect();
        }
        res.send(errorCode, {'isUpdated': status, 'messages': messages});
    }

    Note.findOne({'_id': noteId, 'email': email,'isDeleted':false}, function (err, note) {
        if (err) {
            sendUpdateResponse(false, ['Something went wrong'], 500);
        } else {
            if (note != null) {
                note.description = description;
                note.save(function (err) {
                    if (err) {
                        sendUpdateResponse(false, ['Something went wrong'], 500);
                    } else {
                        sendUpdateResponse(true, [], 200);
                    }
                });
            } else {
                sendUpdateResponse(false, ["Cannot find your note"], 200);
            }
        }
    });
}

var deleteNote = function (req, res, next) {
    var credentials = req.authorization.basic;
    var email = credentials.username;
    var params = req.params;
    var noteId = params.noteId;
    var db = mongoose.connect(connectionString);

    function sendDeleteResponse(status, messages, errorCode) {
        if (db) {
            db.disconnect();
        }
        res.send(errorCode, {'isDeleted': status, 'messages': messages});
    }

    Note.findOne({'_id': noteId, 'email': email,'isDeleted':false}, function (err, note) {
        if (err) {
            sendDeleteResponse(false, ['Something went wrong'], 500);
        } else {
            if (note != null) {
                note.isDeleted = true;
                note.save(function (err) {
                    if (err) {
                        sendDeleteResponse(false, ['Something went wrong'], 500);
                    } else {
                        sendDeleteResponse(true, [], 200);
                    }
                });
            } else {
                sendDeleteResponse(false, ["Cannot find your note"], 200);
            }
        }
    });
}

exports.createNote = createNote;
exports.isTitleAlreadyExistsForUser = isTitleAlreadyExistsForUser;
exports.listNotes = listNotes;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
