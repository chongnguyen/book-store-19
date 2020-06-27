const shortid = require("shortid");

const db = require('../db');

const books = db.get('books').value() || [];

module.exports.index= (req, res) => {
  res.render("books/index", {
    books
  });
};

module.exports.search= (req, res) => {
  var name = req.query.name;
  var bookMatched = books.filter(book => {
    return book.name.toLowerCase().indexOf(name.toLowerCase()) > -1;
  })
  res.render("books/index", {
    books: bookMatched,
    title: name
  });
};

module.exports.create = (req, res) => {
  res.render("books/create");
};

module.exports.view = (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({id: id}).value();
  
  res.render("books/view", {
    book
  });
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get('books').remove({id: id}).write();
  
  res.redirect('back');
};

module.exports.update = (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({id: id}).value();
  
  res.render('books/update', {
    book
  });
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("books")
    .push(req.body)
    .write();
  res.redirect("/book");
};

module.exports.postUpdate = (req, res) => {
  var id = req.params.id;
  db.get('books')
  .find({ id: id })
  .assign(req.body)
  .write()
  
  res.redirect("/book");
};