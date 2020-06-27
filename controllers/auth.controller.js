const bcrypt = require("bcrypt");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const db = require("../db");

var wrongLoginCount = 0;

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = (req, res) => {
  
  var { email, password } = req.body;
  var user = db
    .get("users")
    .find({ email })
    .value();
  
  if (wrongLoginCount > 2) {
    // cấu hình mail
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      })
    );

    // Mail option
    var mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Sending Email using Node.js[nodemailer]",
      text: "Your password: " + user.password
    };

    // Gui mail
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Sendgrid API
    res.render("auth/login", {
      error: "Please recheck password in your email"
    });
    return;
  }
  

  if (!user) {
    wrongLoginCount++;
    res.render("auth/login", {
      error: "Wrong email or password",
      value: req.body
    });
    return;
  }
  
  bcrypt.compare(req.body.password, user.password, function(err, result) {
    // result == true
    if (!result) {
      wrongLoginCount++;
      res.render("auth/login", {
        error: "Wrong email or password",
        value: req.body
      });
      return;
    }
    
    if (user.idAdmin) {
      res.cookie("isAdmin", true);
    }

    res.cookie("userId", user.id, {
      signed: true
    });

    res.redirect("/transaction");
  });
};
