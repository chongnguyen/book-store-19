const express = require("express");
const controller = require("../controllers/transaction.controller");

const router = express.Router();

router.get("/", controller.index);

router.get("/create", controller.create);

router.get("/:id/complete", controller.isComplete);

// router.get("/update/:id", (req, res) => {
//   var id = req.params.id;
//   var book = db.get('transactions').find({id: id}).value();

//   res.render('transactions/update', {
//     book
//   });
// });

router.post("/create", controller.postCreate);

module.exports = router;
