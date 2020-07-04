const express = require("express");
var multer  = require('multer')

var upload = multer({ dest: './public/uploads/' })

const controller = require("../controllers/user.controller");
const validate = require("../validations/user.validation");


const router = express.Router();

router.get("/", controller.index);

router.get("/profile", controller.profile);

router.get("/profile/avatar", controller.updateAvatar);

router.get("/create", controller.create);

router.get("/delete/:id", controller.delete);

router.get("/update/:id", controller.update);

router.post("/create", validate.postCreate, controller.postCreate);

router.post("/update/:id", controller.postUpdate);

router.post("/profile/avatar", upload.single('avatar'), controller.postUpdateAvatar);

module.exports = router;
