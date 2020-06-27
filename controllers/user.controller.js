const shortid = require("shortid");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const db = require("../db");

const users = db.get("users").value() || [];

module.exports.index = (req, res) => {
  res.render("users/index", {
    users: users
  });
};

module.exports.create = (req, res) => {
  res.render("users/create");
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get("users")
    .remove({ id: id })
    .write();

  res.redirect("/user");
};

module.exports.update = (req, res) => {
  var id = req.params.id;
  var user = db
    .get("users")
    .find({ id: id })
    .value();

  res.render("users/update", {
    user
  });
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    req.body.password = hash;
    db.get("users")
      .push(req.body)
      .write();
    res.redirect("/user");
  });
};

module.exports.postUpdate = (req, res) => {
  var id = req.params.id;

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    req.body.password = hash;
    db.get("users")
      .find({ id: id })
      .assign(req.body)
      .write();
    res.redirect("/user");
  });
};
