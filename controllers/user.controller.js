const shortid = require("shortid");
const bcrypt = require("bcrypt");

var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

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

module.exports.profile = (req, res) => {
  var id = req.signedCookies.userId;
  var user = db.get('users').find({id}).value();
  
  res.render('users/profile', {
    user
  })
};

module.exports.updateAvatar = (req, res) => {
  var id = req.signedCookies.userId;
  var user = db.get('users').find({id}).value();
  res.render('users/uploadAvatar', {
    user
  })
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

module.exports.postUpdateAvatar = (req, res) => {
  var id = req.signedCookies.userId;
  var filename = req.file.path.split('/')[2];
  var avatar = "https://res.cloudinary.com/di3tcnhtx/image/upload/v1593609558/avatar_user/" + filename;
  
  console.log(id, filename, avatar);
  cloudinary.v2.uploader.upload(req.file.path, 
  {resource_type: "image", public_id: "avatar_user/" + filename,
  overwrite: true},
  function(error, result) {
    console.log(result, error)
    const fs = require('fs')
    fs.unlinkSync(req.file.path)
  });
  db.get('users')
    .find({id})
    .assign({ avatar })
    .write()
  res.redirect('/user/profile');
}
