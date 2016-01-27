var mongoose = require('mongoose');
var Note = require("../models/note");
var helper = require("../helpers/helper");
var connectionString = 'mongodb://localhost/notes';

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
    Note.findOne({'email': email, 'title': title}, function (err, note) {
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
        newNote.save(newNote, function (err) {
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

exports.createNote = createNote;
exports.isTitleAlreadyExistsForUser = isTitleAlreadyExistsForUser;
