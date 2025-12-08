const express = require("express");
const router = express.Router();
const controller = require("../controllers/flower.controller");

router.get("/", controller.getAllFlowers);

module.exports = router;
