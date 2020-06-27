var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const db = require("../db");

module.exports.forgot = (req, res) => {
  res.render("auth/forgot");
};

module.exports.postForgot = (req, res) => {
  var { email } = req.body;
  var code = Math.floor(getRandomArbitrary(100000, 999999));
  
  var user = db
    .get("users")
    .find({ email })
    .value();

  if (!email) {
    res.render("auth/forgot", {
      error: "Email does not exists",
      value: req.body
    });
    return;
  }

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
    text: "Code Verification: " + getRandomArbitrary
  };

  // Gui mail
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.render("auth/verifyCode", {
    email,
    code
  });

  res.redirect("/transaction");
};

// generator Code random
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}