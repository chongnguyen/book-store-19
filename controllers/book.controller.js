const shortid = require("shortid");
var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

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
  var filename = req.file.path.split('/')[2];
  req.body.image = "https://res.cloudinary.com/di3tcnhtx/image/upload/v1593609558/avatar_user/" + filename;
  cloudinary.v2.uploader.upload(req.file.path, 
  {resource_type: "image", public_id: "avatar_user/" + filename,
  overwrite: true},
  function(error, result) {
    console.log(result, error)
    const fs = require('fs')
    fs.unlinkSync(req.file.path)
  });
    
  
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