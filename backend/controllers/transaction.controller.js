const db = require("../models");

// Créer une nouvelle transaction
exports.createTransaction = async (req, res) => {
  try {
    const { userId, items } = req.body;
    // items = [{ bouquetId, quantity, price }, ...]

    // Calculer le total
    const total = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Créer la transaction
    const transaction = await db.Transaction.create({
      UserId: userId,
      total,
      status: 'completed'
    });

    // Ajouter les items
    for (const item of items) {
      await db.TransactionItem.create({
        TransactionId: transaction.id,
        BouquetId: item.bouquetId,
        quantity: item.quantity,
        price: item.price
      });
    }

    // Récupérer la transaction complète avec les détails
    const completeTransaction = await db.Transaction.findByPk(transaction.id, {
      include: [
        {
          model: db.Bouquet,
          through: { attributes: ['quantity', 'price'] }
        },
        {
          model: db.User,
          attributes: ['id', 'nomComplet', 'login']
        }
      ]
    });

    res.status(201).json(completeTransaction);
  } catch (error) {
    console.error("Erreur createTransaction:", error);
    res.status(500).json({ message: "Erreur lors de la création de la transaction" });
  }
};

// Récupérer toutes les transactions d'un utilisateur
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    const transactions = await db.Transaction.findAll({
      where: { UserId: userId },
      include: [
        {
          model: db.Bouquet,
          through: { attributes: ['quantity', 'price'] }
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error("Erreur getUserTransactions:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Récupérer une transaction par ID
exports.getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;

    const transaction = await db.Transaction.findByPk(id, {
      include: [
        {
          model: db.Bouquet,
          through: { attributes: ['quantity', 'price'] }
        },
        {
          model: db.User,
          attributes: ['id', 'nomComplet', 'login']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction introuvable" });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Erreur getTransactionById:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Récupérer toutes les transactions (admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await db.Transaction.findAll({
      include: [
        {
          model: db.User,
          attributes: ['id', 'nomComplet', 'login']
        },
        {
          model: db.Bouquet,
          through: { attributes: ['quantity', 'price'] }
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error("Erreur getAllTransactions:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};