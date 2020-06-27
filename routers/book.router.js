const express = require('express');

const controller = require('../controllers/book.controller');


const router = express.Router();


router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.create);

router.get("/:id", controller.view);

router.get("/delete/:id", controller.delete);

router.get("/update/:id", controller.update);

router.post("/create", controller.postCreate);

router.post("/update/:id", controller.postUpdate);


module.exports = router;