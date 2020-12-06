const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let id;
let badID = 'fauxid0a833b53060392e47c';
chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book Title'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.equal(res.body.title, 'Test Book Title');
            id = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send()
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          });
      });      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/' + badID)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.equal(res.body._id, id);
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + id)
          .send({ comment: 'New test comment.'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.property(res.body, '_id');
            assert.equal(res.body.comments[0], 'New test comment.');
            assert.equal(res.body.title, 'Test Book Title');
            assert.equal(res.body._id, id);
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + id)
          .send()
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/' + badID)
          .send({ comment: 'New test comment 2' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/' + id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/' + badID)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
  });
});
