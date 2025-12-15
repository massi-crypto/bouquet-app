const db = require("../models");

exports.addToCart = (req, res) => {
  try {
    const { bouquetId, quantity = 1 } = req.body;

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.bouquetId === bouquetId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({ bouquetId, quantity });
    }

    res.json({ 
      message: "Ajouté au panier",
      cart: req.session.cart 
    });
  } catch (error) {
    console.error("Erreur addToCart:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

exports.getCart = async (req, res) => {
  try {
    if (!req.session.cart || req.session.cart.length === 0) {
      return res.json({ items: [], total: 0 });
    }

    const cartWithDetails = await Promise.all(
      req.session.cart.map(async (item) => {
        const bouquet = await db.Bouquet.findByPk(item.bouquetId);
        return {
          bouquetId: item.bouquetId,
          quantity: item.quantity,
          bouquet: bouquet ? bouquet.toJSON() : null,
          subtotal: bouquet ? bouquet.price * item.quantity : 0
        };
      })
    );

    const total = cartWithDetails.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ 
      items: cartWithDetails,
      total 
    });
  } catch (error) {
    console.error("Erreur getCart:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

exports.removeFromCart = (req, res) => {
  try {
    const { bouquetId } = req.body;

    if (!req.session.cart) {
      return res.status(404).json({ message: "Panier vide" });
    }

    req.session.cart = req.session.cart.filter(item => item.bouquetId !== bouquetId);

    res.json({ 
      message: "Retiré du panier",
      cart: req.session.cart 
    });
  } catch (error) {
    console.error("Erreur removeFromCart:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

exports.clearCart = (req, res) => {
  try {
    req.session.cart = [];
    res.json({ message: "Panier vidé" });
  } catch (error) {
    console.error("Erreur clearCart:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    if (!userId) {
      return res.status(400).json({ message: "Utilisateur non connecté" });
    }

    let total = 0;
    const items = [];

    for (const item of req.session.cart) {
      const bouquet = await db.Bouquet.findByPk(item.bouquetId);
      if (bouquet) {
        const subtotal = bouquet.price * item.quantity;
        total += subtotal;
        items.push({
          bouquetId: item.bouquetId,
          quantity: item.quantity,
          price: bouquet.price
        });
      }
    }

    const transaction = await db.Transaction.create({
      UserId: userId,
      total,
      status: 'completed'
    });

    for (const item of items) {
      await db.TransactionItem.create({
        TransactionId: transaction.id,
        BouquetId: item.bouquetId,
        quantity: item.quantity,
        price: item.price
      });
    }

    req.session.cart = [];

    const completeTransaction = await db.Transaction.findByPk(transaction.id, {
      include: [
        {
          model: db.Bouquet,
          through: { attributes: ['quantity', 'price'] }
        }
      ]
    });

    res.json({ 
      message: "Achat effectué avec succès",
      transaction: completeTransaction 
    });
  } catch (error) {
    console.error("Erreur checkout:", error);
    res.status(500).json({ message: "Erreur lors de l'achat" });
  }
};