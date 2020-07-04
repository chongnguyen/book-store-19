const db = require('../db');

module.exports.authLogin = (req, res, next) => {
  var id = req.signedCookies.userId;
  if(!id){
    res.redirect('/auth/login');
    return;
  }
  var user = db.get('users').find({id}).value();
  
  if(!user){
    res.redirect('/auth/login');
  }
  
  res.locals.isAdmin= user.isAdmin;
  
  next();
}