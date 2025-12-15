const express = require("express");
const router = express.Router();
const controller = require("../controllers/backoffice.controller");

// Initialiser un nouveau bouquet
router.post("/bouquet/start", controller.startBouquet);

// Ajouter une fleur
router.post("/bouquet/add-flower", controller.addFlowerToBouquet);

// Retirer une fleur
router.delete("/bouquet/remove-flower", controller.removeFlowerFromBouquet);

// Récupérer le bouquet en cours
router.get("/bouquet/current", controller.getCurrentBouquet);

// Finaliser le bouquet
router.post("/bouquet/finalize", controller.finalizeBouquet);

// Annuler le bouquet
router.delete("/bouquet/cancel", controller.cancelBouquet);

module.exports = router;