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
server.post('/note/update', userController.authenticationHandler, noteController.updateNote);
server.post('/note/delete', userController.authenticationHandler, noteController.deleteNote);

server.listen(port, function () {
    console.log('%s#%s listening at %s', server.name, server.versions, port);
});

//Sample inputs

//for api /user/register
//Sample input
//{"email":"chandra@gmail.com","password":"chandra"}

//for /note/create
//Sample input
//Body  = {"title":"Note 111123","description":"Note 1111 is a new note with meta data modifier exited"}
//Header "Authorization":"Basic Y2hhbmRyYW1vaGEuNEBnbWFpbC5jb206Y2hhbmRyYQ=="   for above mentioned username and password

//for /note/list
//Sample input
//Header "Authorization":"Basic Y2hhbmRyYW1vaGEuNEBnbWFpbC5jb206Y2hhbmRyYQ=="   for above mentioned username and password

//for /note/update
//Sample input
//Body = {"noteId":"56a8b80ec8c85ece257ba84e","description":"new data"} where noteId is the documentId of note
//Header "Authorization":"Basic Y2hhbmRyYW1vaGEuNEBnbWFpbC5jb206Y2hhbmRyYQ=="   for above mentioned username and password

//for /note/delete
//Sample input
//Body = {"noteId":"56a8b80ec8c85ece257ba84e"}
//Header "Authorization":"Basic Y2hhbmRyYW1vaGEuNEBnbWFpbC5jb206Y2hhbmRyYQ=="   for above mentioned username and password