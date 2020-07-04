const express = require('express');
var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' })

const controller = require('../controllers/book.controller');


const router = express.Router();


router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.create);

router.get("/:id", controller.view);

router.get("/delete/:id", controller.delete);

router.get("/update/:id", controller.update);

router.post("/create", upload.single('image'),controller.postCreate);

router.post("/update/:id", controller.postUpdate);


module.exports = router;