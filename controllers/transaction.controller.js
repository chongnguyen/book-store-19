const shortid = require("shortid");

const db = require("../db");



module.exports.index = (req, res) => {
  // var users =
  let {userId, isAdmin} = req.signedCookies;
  // isAdmin = true;
  var user = db.get('users').find({id: userId}).value();
  if(!user){
    res.redirect('/');
    return;
  }
  
  let transactions = [];
  if(isAdmin){
     transactions = db.get("transactions").value() || [];
  } else {
     transactions = db.get("transactions").filter({userId}).value() || [];
  }
  var trans = transactions.map(item => {
    var book =
      db
        .get("books")
        .find({ id: item.bookId })
        .value() || {};
    var user =
      db
        .get("users")
        .find({ id: item.userId })
        .value() || {};
    var { id, state } = item;
    return { book, user, id , state};
  });
  res.render("transactions/index", {
    transactions: trans,
    isAdmin
  });
};

module.exports.create = (req, res) => {
  var users = db.get("users").value() || [];
  var books = db.get("books").value() || [];
  console.log(users, books);
  res.render("transactions/create", {
    users,
    books
  });
};

// module.exports.complete = (req, res) => {

// };

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  req.body.state = false;
  console.log(req.body);
  db.get("transactions")
    .push(req.body)
    .write();
  res.redirect("/transaction");
};

module.exports.isComplete = (req, res) => {
  var { id } = req.params;
  var tran = db
    .get("transactions")
    .find({ id })
    .value();
  if(!tran) {
    res.send("<h1>Not found 404 </h1>");
    return 0;
  }
  var state = !tran.state;
  var trans = db
    .get("transactions")
    .find({ id })
    .assign({ state: state })
    .write();
  console.log(trans);
  res.redirect("/transaction");
};
