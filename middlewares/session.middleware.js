const shortid = require('shortid');
const db = require('../db');

module.exports.session = (req, res, next) => {
  let id = req.signedCookies.sessionId;
  if(!id){
    let id = shortid.generate();
    res.cookie('sessionId', id, {
      signed: true
    });
    
    db.get('sessions').push({id}).write();
  }
  res.locals.items = db.get('sessions').find({id}).get('cart', 0).size().value();
  next();
};