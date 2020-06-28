var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const db = require("../db");

// let code = 0;

module.exports.forgot = (req, res) => {
  res.render("auth/forgot");
};

module.exports.reset = (req, res) => {
  console.log(req.params);
  var { code } = req.params;
  var user = db
    .get("users")
    .find({ resetPasswordToken: code })
    .value();
  if (!user) {
    console.log("khong ton tai user");
    res.redirect("/forgot");
    return;
  }
  res.render("auth/resetPass");
};

module.exports.postReset = (req, res) => {
  var { password, confirm } = req.body;
  var { code } = req.params;

  if (password !== confirm) {
    res.render("auth/resetPass", {
      error: "Wrong confirm password!"
    });
    return;
  }

  var user = db
    .get("users")
    .find({ resetPasswordToken: code })
    .value();
  if (!user) {
    console.log("Khong ton tai user");
    res.redirect("/forgot");
    return;
  }
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    user.password = hash;
    user.resetPasswordToken = undefined;
    db.get("users")
      .find({ resetPasswordToken: code })
      .assign(user)
      .write();
    // req.body.password = hash;
    
    res.render("/auth/login");
  });
  
};

module.exports.postForgot = (req, res) => {
  var { email } = req.body;
  var code = Math.floor(getRandomArbitrary(100000, 999999));

  var user = db
    .get("users")
    .find({ email })
    .value();

  if (!user) {
    res.render("auth/forgot", {
      error: "Email does not exists",
      value: req.body
    });
    return;
  }

  // user.resetPassToken = code;
  db.get("users")
    .find({ email })
    .assign({ resetPasswordToken: code.toString() })
    .write();

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
    subject: "Forgot password",
    text: "https://book-store-19.glitch.me/forgot/" + code
  };

  // Gui mail
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  // res.render("auth/verifyCode", {
  //   email,
  //   code
  // });
  res.render("auth/verify");
};

// module.exports.
// generator Code random
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
