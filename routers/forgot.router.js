const express = require("express");

const controller = require("../controllers/forgot.controller");

const router = express.Router();

router.get("/", controller.forgot);
router.get("/:code", controller.reset);

router.post('/', controller.postForgot);
router.post("/:code", controller.postReset);

module.exports = router;
