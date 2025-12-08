const express = require("express");
const router = express.Router();
const controller = require("../controllers/bouquet.controller");

router.get("/", controller.getAllBouquets);
router.get("/:id", controller.getBouquetById);
router.get("/:id/composition", controller.getBouquetComposition);


module.exports = router;
