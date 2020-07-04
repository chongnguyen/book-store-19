const db = require('../db');

module.exports.index = (req, res) => {
  let cart = db.get('sessions').find({
    id: req.signedCookies.sessionId
  }).value().cart;
  
  
  var listItem = [];
  for(let key in cart){
    listItem.push(db.get('books').find({id: key}).value())
  }
  
//   get user
  var userId = req.signedCookies.userId;
  var user = db.get('users').find({id: userId}).value();
  
  res.render('carts/index', {
    listItem,
    user
  });
}

module.exports.addToCart = (req, res) => {
  let id = req.signedCookies.sessionId;
  let {productId} = req.params;
  
  if(!id || !productId) {
    res.redirect('/book');
  }
  
  let count = db.get('sessions').find({id}).get('cart.' + productId, 0).value();
  var test = db.get('sessions').find({id}).set('cart.' + productId, count + 1).write();
  
  res.send('<script>alert("Đã thêm vào giỏ"); document.location = "/book";</script>');
}

module.exports.deleteFromCart = (req, res) => {
  let id = req.signedCookies.sessionId;
  let {productId} = req.params;
  
  let cart = db.get('sessions')
    .find({id}).value().cart;
  
  delete cart[productId];
  
  db.get('sessions')
  .find({ id })
  .assign({ cart })
  .write();
  
  res.send('<script>alert("Đã xóa khỏi giỏ"); document.location = "/cart";</script>');
}
