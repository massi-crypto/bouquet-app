const db = require("../models");

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

    res.json(bouquets);
  } catch (error) {
    console.error("Erreur Controller:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

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

    res.json(bouquet);
  } catch (error) {
    console.error("Erreur getBouquetById:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

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
