const shortid = require("shortid");

const db = require('../db');


const books = db.get('books').value() || [];

module.exports.index= (req, res) => {
  var page = req.query.page || 1;
  var n = 20;
  var start = (page - 1) * n;
  var end = page * n;

  var previous = {state: '', value: page - 1};
  var next = {state: '', value: page - -1};
  
  var len = Math.ceil(books.length / n);
  var pagination = [];

  if(page <= 1){
    pagination = [1, 2, 3];
  } else if(page >= len) {
    pagination = [len - 2, len - 1, len];
  } else {
    pagination = [page - 1, page, page - -1];
  }

  if(page == len){
    next.state = 'disabled';
  }
  if(page == 1){
    previous.state = 'disabled';
  }
  res.render("books/index", {
    books: books.slice(start, end),
    pagination,
    pageCurrent: page,
    next,
    previous
  })
  // res.render("books/index", {
  //   books
  // });
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