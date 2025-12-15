const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");

// Créer une nouvelle transaction
router.post("/", controller.createTransaction);

// Récupérer toutes les transactions (admin)
router.get("/", controller.getAllTransactions);

// Récupérer une transaction par ID
router.get("/:id", controller.getTransactionById);

// Récupérer les transactions d'un utilisateur
router.get("/user/:userId", controller.getUserTransactions);

module.exports = router;