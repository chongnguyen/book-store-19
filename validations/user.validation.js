const db = require("../db");

module.exports.postCreate = (req, res, next) => {
  var {email, password, confirm} = req.body;
  var len = email.length;
  var error = "";

  if (len > 30) {
    error = "Username is only maximum 30 characters!";
  } else if(password !== confirm){
    error = "Wrong confirm password"
  } else {
    var user = db
      .get("users")
      .find({ email })
      .value();
    if (user) {
      error = "Username already exists ";
    }
  }
  
  

  if (error) {
    res.render("users/create", {
      error,
      value: req.body
    });
    return 1;
  }
  delete req.body.confirm;
  next();
};
