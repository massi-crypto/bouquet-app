const express = require("express");
const router = express.Router();
const controller = require("../controllers/bouquet.controller");

// Récupérer tous les bouquets
router.get("/", controller.getAllBouquets);

// Récupérer un bouquet par ID
router.get("/:id", controller.getBouquetById);

// Récupérer la composition d'un bouquet
router.get("/:id/composition", controller.getBouquetComposition);

// Créer un nouveau bouquet
router.post("/", controller.createBouquet);

// Mettre à jour un bouquet
router.put("/:id", controller.updateBouquet);

// Supprimer un bouquet
router.delete("/:id", controller.deleteBouquet);

module.exports = router;