const chai = require('chai');
const chaiHttp = require('chai-http');

const {
    app, closeServer, runServer
} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function () {
    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    it('should list items on GET', function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                res.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.have.all.keys('id', 'title', 'content', 'author', 'publishDate')
                });
            });
    });

    it('should add an item on POST', function () {
        const newPost = {
            title: 'Title of Post',
            content: 'The content of the post will go here',
            author: 'First Last'
        };
        const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));
        return chai.request(app)
            .post('/blog-posts')
            .send(newPost)
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.all.keys(expectedKeys);
                res.body.title.should.equal(newPost.title);
                res.body.content.should.equal(newPost.content);
                res.body.author.should.equal(newPost.author)
            });
    });
    it('should error if POST is missing expected values', function () {
        const badRequestData = {};
        return chai.request(app)
            .post('/blog-posts')
            .send(badRequestData)
            .end(function (err.res) {
                res.should.have.status(400);
            });
    });

    it('should update an item on PUT', function () {
        return chai.request(app)
            .get('/blog-posts')
            .end(function (err, res) {
                const updatedPost = Object.assign(res.body[0], {
                    title: 'The title goes here',
                    content: 'More content will go here'
                });
                return chai.request(app)
                    .put(`/blog-post/${res.body[0].id}`)
                    .send(updatedPost)
                    .end(function (err, res) {
                        res.should.have.status(204);
                        res.should.be.json;
                    });
            });
    });
    it('should delete posts on DELETE', function () {
        return chai.request(app)
            .get('/blog-posts')
            .end(function (err, res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`)
                    .end(function (err, res) {
                        res.should.have.status(204);
                    });
            });
    });
});
