const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

// Créer un utilisateur
router.post("/register", controller.createUser);

// Login
router.post("/login", controller.login);

// Logout
router.post("/logout", controller.logout);

// Récupérer le profil complet
router.get("/:userId/profile", controller.getUserProfile);

// Récupérer les bouquets likés
router.get("/:userId/liked", controller.getLikedBouquets);

// Liker un bouquet
router.post("/like", controller.likeBouquet);

// Unlike un bouquet
router.delete("/unlike", controller.unlikeBouquet);

// Mettre à jour le profil
router.put("/:userId/profile", controller.updateProfile);

module.exports = router;