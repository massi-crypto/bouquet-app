const express = require("express");
const router = express.Router();
const controller = require("../controllers/cart.controller");

router.post("/add", controller.addToCart);
router.get("/", controller.getCart);
router.delete("/remove", controller.removeFromCart);
router.delete("/clear", controller.clearCart);
router.post("/checkout", controller.checkout);

module.exports = router;