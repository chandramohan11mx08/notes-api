var restify = require('restify');
var package = require('../notes-api/package.json');
var userController = require("./app/controllers/user");

var server = restify.createServer({
    name: package.name,
    version: package.version
});

var port = process.env.PORT || 3000;

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.pre.sanitizePath());


server.post('/user/register', userController.registerUser);

server.listen(port, function () {
    console.log('%s#%s listening at %s', server.name, server.versions, port);
});
