var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000');

describe('User', function () {
    it('should add a new user with email admin@gmail.com on /user/register POST', function (done) {
        api.post("/user/register")
            .send({'email': 'admin@gmail.com', 'password': 'admin'})
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property("status");
                expect(res.body).to.have.property("messages");
                expect(res.body.status).to.equal(true);
                done();
            });
    });

    it('should not add a new user with same email admin@gmail.com on /user/register POST', function (done) {
        api.post("/user/register")
            .send({'email': 'admin@gmail.com', 'password': 'admin'})
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property("status");
                expect(res.body).to.have.property("messages");
                expect(res.body.status).to.equal(false);
                expect(res.body.messages[0]).to.equal("Email address already exists");
                done();
            });
    });
});


describe('Notes', function () {
    it('should fail to create new note with incorrect password for email admin@gmail.com on /note/create POST', function (done) {
        api.post("/note/create")
            .auth('admin@gmail.com', 'admiasdsdsdsn')
            .send({'title': 'Note 1', 'description': 'This is a new note'})
            .expect(401)
            .end(function (err, res) {
                expect(res.body).to.have.property("authenticated");
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('should create new note with correct email and password on /note/create POST', function (done) {
        api.post("/note/create")
            .auth('admin@gmail.com', 'admin')
            .send({'title': 'Note 1', 'description': 'This is a new note'})
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property("isCreated");
                expect(res.body.isCreated).to.equal(true);
                done();
            });
    });

    it('should fail to create new note with same title for same user on /note/create POST', function (done) {
        api.post("/note/create")
            .auth('admin@gmail.com', 'admin')
            .send({'title': 'Note 1', 'description': 'This is a new note'})
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property("isCreated");
                expect(res.body.isCreated).to.equal(false);
                expect(res.body).to.have.property("messages");
                expect(res.body.messages[0]).to.equal("You already have a note with same title ");
                done();
            });
    });

    it('should not return notes for wrong credentials for this user on /note/list GET', function (done) {
        api.get("/note/list")
            .auth('admin@gmail.com', 'adsdsdmin')
            .expect(401)
            .end(function (err, res) {
                expect(res.body).to.have.property("authenticated");
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('should return array of notes for this user on /note/list GET', function (done) {
        api.get("/note/list")
            .auth('admin@gmail.com', 'admin')
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property("notes");
                expect(res.body.notes[0].title).to.equal("Note 1");
                done();
            });
    });
});