/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

let mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (err, db) => {
  if (err) return console.log(err);
  console.log('Database connected.');
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [{ type: String }]
});

let bookModel = mongoose.model('book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      bookModel.find({}, (err, allBooks) => {
        if (err) return console.log(err);
        let bookList = [];
        allBooks.forEach((book) => {
          bookList.push({_id: book._id, title: book.title, commentcount: book.comments.length });
        })
        return res.json(bookList);
      })
    })
    
    .post(function (req, res){
      if (!req.body.title) return res.send('missing required field title');
      let book = { title: req.body.title }
      bookModel.create(book, (err, newBook) => {
        if (err) return console.log(err);
        return res.json(newBook);
      });
    })
    
    .delete(function(req, res){
      bookModel.find({}, (err, allBooks) => {
        if (err) return console.log(err);
        allBooks.forEach((book) => {
          bookModel.findByIdAndRemove(book._id, (err, deletedBook) => {
            if (err) return console.log(err);
          });
        });
        return res.send('complete delete successful');
      });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      bookModel.findById(req.params.id, (err, foundBook) => {
        if (!foundBook) return res.send('no book exists');
        if (err) return console.log(err);
        return res.json(foundBook);
      });
    })
    
    .post(function(req, res){
      if (!req.body.comment) return res.send('missing required field comment');
      bookModel.findById(req.params.id, (err, foundBook) => {
        if (!foundBook) return res.send('no book exists');
        if (err) return console.log(err);
        foundBook.comments.push(req.body.comment);
        foundBook.save((err, savedBook) => {
          if (err) return console.log(err);
          return res.json(savedBook);
        });
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      if (!req.params.id) return res.send('missing required field id');
      bookModel.findByIdAndRemove(req.params.id, (err, deletedBook) => {
        if (!deletedBook) return res.send('no book exists');
        if (err) return console.log(err);
        return res.send('delete successful');
      });
    });
  
};
