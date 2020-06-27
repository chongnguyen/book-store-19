const express = require("express");

const controller = require("../controllers/forgot.controller");

const router = express.Router();

router.get("/", controller.forgot);

router.post('/', controller.postForgot);

module.exports = router;
