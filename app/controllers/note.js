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

var createNote = function (req, res, next) {
    var params = req.params;
    var title = params.title.trim();
    var description = params.description.trim();

    var validationResult = helper.validateTitleAndDescription(title, description);
    if (validationResult.isValid) {
        var authorization = req.headers["authorization"];
        var tmp = authorization.split(' ');
        var credentials = new Buffer(tmp[1], 'base64').toString().split(':');
        var email = credentials[0];

        var newNote = getNewNote(email, title, description);

        var db = mongoose.connect(connectionString);
        newNote.save(newNote, function (err) {
            db.disconnect();
            var isSaved = err ? false : true;
            sendResponse(true, []);
        });
    } else {
        sendResponse(false, validationResult.messages);
    }

    function sendResponse(isCreated, messages) {
        res.send({'isCreated': isCreated, 'messages': messages});
    }
};

exports.createNote = createNote;