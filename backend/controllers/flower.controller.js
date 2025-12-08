const db = require("../models");

exports.getAllFlowers = async (req, res) => {
  try {
    const flowers = await db.Flower.findAll();
    res.json(flowers);
  } catch (error) {
    console.error("Erreur getAllFlowers:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};
