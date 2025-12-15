const db = require("../models");

// Récupérer tous les bouquets avec leurs fleurs et le nombre de likes
exports.getAllBouquets = async (req, res) => {
  try {
    const bouquets = await db.Bouquet.findAll({
      include: [
        {
          model: db.Flower,
          through: { attributes: ["quantity"] }
        }
      ]
    });

    // Compter les likes pour chaque bouquet
    const bouquetsWithLikes = await Promise.all(
      bouquets.map(async (bouquet) => {
        const likesCount = await db.Like.count({
          where: { BouquetId: bouquet.id }
        });
        
        return {
          ...bouquet.toJSON(),
          likesCount
        };
      })
    );

    res.json(bouquetsWithLikes);
  } catch (error) {
    console.error("Erreur Controller:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Récupérer un bouquet par ID
exports.getBouquetById = async (req, res) => {
  try {
    const id = req.params.id;

    const bouquet = await db.Bouquet.findByPk(id, {
      include: [
        {
          model: db.Flower,
          through: { attributes: ["quantity"] }
        }
      ]
    });

    if (!bouquet) {
      return res.status(404).json({ message: "Bouquet introuvable" });
    }

    // Compter les likes
    const likesCount = await db.Like.count({
      where: { BouquetId: id }
    });

    res.json({
      ...bouquet.toJSON(),
      likesCount
    });
  } catch (error) {
    console.error("Erreur getBouquetById:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Récupérer la composition d'un bouquet
exports.getBouquetComposition = async (req, res) => {
  try {
    const id = req.params.id;

    const bouquet = await db.Bouquet.findByPk(id, {
      include: [
        {
          model: db.Flower,
          attributes: ["id", "name", "unitPrice"],
          through: { attributes: ["quantity"] }
        }
      ]
    });

    if (!bouquet) {
      return res.status(404).json({ message: "Bouquet introuvable" });
    }

    res.json(bouquet.Flowers);
  } catch (error) {
    console.error("Erreur composition:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Créer un nouveau bouquet
exports.createBouquet = async (req, res) => {
  try {
    const { name, description, image, price, flowers } = req.body;

    // Créer le bouquet
    const bouquet = await db.Bouquet.create({
      name,
      description,
      image,
      price: parseFloat(price)
    });

    // Ajouter les fleurs si fournies
    if (flowers && flowers.length > 0) {
      for (const flower of flowers) {
        await db.BouquetFlower.create({
          BouquetId: bouquet.id,
          FlowerId: flower.flowerId,
          quantity: flower.quantity
        });
      }
    }

    res.status(201).json(bouquet);
  } catch (error) {
    console.error("Erreur createBouquet:", error);
    res.status(500).json({ message: "Erreur lors de la création" });
  }
};

// Mettre à jour un bouquet
exports.updateBouquet = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, image, price } = req.body;

    const bouquet = await db.Bouquet.findByPk(id);
    
    if (!bouquet) {
      return res.status(404).json({ message: "Bouquet introuvable" });
    }

    await bouquet.update({
      name,
      description,
      image,
      price
    });

    res.json(bouquet);
  } catch (error) {
    console.error("Erreur updateBouquet:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// Supprimer un bouquet
exports.deleteBouquet = async (req, res) => {
  try {
    const id = req.params.id;

    const bouquet = await db.Bouquet.findByPk(id);
    
    if (!bouquet) {
      return res.status(404).json({ message: "Bouquet introuvable" });
    }

    await bouquet.destroy();

    res.json({ message: "Bouquet supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteBouquet:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

// Récupérer les utilisateurs qui ont liké un bouquet
exports.getBouquetLikers = async (req, res) => {
  try {
    const bouquetId = req.params.id;

    const bouquet = await db.Bouquet.findByPk(bouquetId, {
      include: [{
        model: db.User,
        as: 'Likers',
        attributes: ['id', 'nomComplet', 'login'],
        through: { attributes: [] }
      }]
    });

    if (!bouquet) {
      return res.status(404).json({ message: "Bouquet introuvable" });
    }

    res.json(bouquet.Likers);
  } catch (error) {
    console.error("Erreur getBouquetLikers:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};