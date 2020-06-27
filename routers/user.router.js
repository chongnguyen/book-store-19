const express = require("express");

const controller = require("../controllers/user.controller");
const validate = require("../validations/user.validation");


const router = express.Router();

router.get("/", controller.index);

router.get("/create", controller.create);

router.get("/delete/:id", controller.delete);

router.get("/update/:id", controller.update);

router.post("/create", validate.postCreate, controller.postCreate);

router.post("/update/:id", controller.postUpdate);

module.exports = router;
