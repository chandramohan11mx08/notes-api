var restify = require('restify');
var package = require('../notes-api/package.json');
var userController = require("./app/controllers/user");
var noteController = require("./app/controllers/note");

var server = restify.createServer({
    name: package.name,
    version: package.version
});

var port = process.env.PORT || 3000;

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.pre.sanitizePath());
server.use(restify.authorizationParser());

server.post('/user/register', userController.isEmailAllReadyExists, userController.registerUser);

server.post('/note/create', userController.authenticationHandler, noteController.isTitleAlreadyExistsForUser, noteController.createNote);
server.post('/note/list', userController.authenticationHandler, noteController.listNotes);

server.listen(port, function () {
    console.log('%s#%s listening at %s', server.name, server.versions, port);
});
