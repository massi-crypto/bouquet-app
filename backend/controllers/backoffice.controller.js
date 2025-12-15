const db = require("../models");

// Initialiser un nouveau bouquet en session
exports.startBouquet = (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    
    req.session.bouquetEnCours = {
      name,
      description,
      image,
      price: parseFloat(price),
      flowers: [] // Liste des fleurs avec leurs quantités
    };
    
    res.json({ 
      message: "Bouquet initialisé en session",
      bouquet: req.session.bouquetEnCours 
    });
  } catch (error) {
    console.error("Erreur startBouquet:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Ajouter une fleur au bouquet en cours
exports.addFlowerToBouquet = (req, res) => {
  try {
    const { flowerId, quantity } = req.body;
    
    if (!req.session.bouquetEnCours) {
      return res.status(400).json({ 
        message: "Aucun bouquet en cours. Initialisez d'abord un bouquet." 
      });
    }
    
    // Vérifier si la fleur existe déjà
    const existingFlower = req.session.bouquetEnCours.flowers.find(
      f => f.flowerId === flowerId
    );
    
    if (existingFlower) {
      existingFlower.quantity = parseInt(quantity);
    } else {
      req.session.bouquetEnCours.flowers.push({
        flowerId: parseInt(flowerId),
        quantity: parseInt(quantity)
      });
    }
    
    res.json({ 
      message: "Fleur ajoutée",
      bouquet: req.session.bouquetEnCours 
    });
  } catch (error) {
    console.error("Erreur addFlowerToBouquet:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Retirer une fleur du bouquet en cours
exports.removeFlowerFromBouquet = (req, res) => {
  try {
    const { flowerId } = req.body;
    
    if (!req.session.bouquetEnCours) {
      return res.status(400).json({ message: "Aucun bouquet en cours" });
    }
    
    req.session.bouquetEnCours.flowers = 
      req.session.bouquetEnCours.flowers.filter(f => f.flowerId !== parseInt(flowerId));
    
    res.json({ 
      message: "Fleur retirée",
      bouquet: req.session.bouquetEnCours 
    });
  } catch (error) {
    console.error("Erreur removeFlowerFromBouquet:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Récupérer le bouquet en cours
exports.getCurrentBouquet = (req, res) => {
  try {
    if (!req.session.bouquetEnCours) {
      return res.status(404).json({ message: "Aucun bouquet en cours" });
    }
    
    res.json(req.session.bouquetEnCours);
  } catch (error) {
    console.error("Erreur getCurrentBouquet:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Finaliser et sauvegarder le bouquet
exports.finalizeBouquet = async (req, res) => {
  try {
    if (!req.session.bouquetEnCours) {
      return res.status(400).json({ message: "Aucun bouquet en cours" });
    }
    
    const bouquetData = req.session.bouquetEnCours;
    
    // Créer le bouquet dans la BD
    const bouquet = await db.Bouquet.create({
      name: bouquetData.name,
      description: bouquetData.description,
      image: bouquetData.image,
      price: bouquetData.price
    });
    
    // Ajouter les fleurs
    for (const flower of bouquetData.flowers) {
      await db.BouquetFlower.create({
        BouquetId: bouquet.id,
        FlowerId: flower.flowerId,
        quantity: flower.quantity
      });
    }
    
    // Supprimer le bouquet de la session
    delete req.session.bouquetEnCours;
    
    res.json({ 
      message: "Bouquet créé avec succès",
      bouquet 
    });
  } catch (error) {
    console.error("Erreur finalizeBouquet:", error);
    res.status(500).json({ message: "Erreur lors de la création" });
  }
};

// Annuler le bouquet en cours
exports.cancelBouquet = (req, res) => {
  try {
    delete req.session.bouquetEnCours;
    res.json({ message: "Bouquet annulé" });
  } catch (error) {
    console.error("Erreur cancelBouquet:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};