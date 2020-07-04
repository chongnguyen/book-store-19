const express = require("express");

const controller = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", controller.index);

router.get("/add/:productId", controller.addToCart);

router.get("/delete/:productId", controller.deleteFromCart);



module.exports = router;
