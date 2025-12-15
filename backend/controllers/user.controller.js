const db = require("../models");

// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const { login, password, nomComplet } = req.body;
    
    const user = await db.User.create({
      login,
      password,
      nomComplet
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error("Erreur createUser:", error);
    res.status(500).json({ message: "Erreur lors de la création" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    
    const user = await db.User.findOne({ where: { login } });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      login: user.login,
      nomComplet: user.nomComplet,
      role: user.role
    };
    
    res.json({ message: "Connexion réussie", user: req.session.user });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Déconnexion réussie" });
};

// Récupérer le profil complet d'un utilisateur
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await db.User.findByPk(userId, {
      attributes: ['id', 'login', 'nomComplet', 'role', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Récupérer les likes séparément
    const likedBouquets = await db.Bouquet.findAll({
      include: [{
        model: db.User,
        as: 'Likers',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }]
    });

    // Récupérer les transactions séparément
    const transactions = await db.Transaction.findAll({
      where: { UserId: userId },
      include: [{
        model: db.Bouquet,
        through: { attributes: ['quantity', 'price'] }
      }],
      order: [['date', 'DESC']]
    });

    // Calculer des statistiques
    const totalTransactions = transactions.length;
    const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.total || 0), 0);
    const totalLikes = likedBouquets.length;

    res.json({
      user: {
        id: user.id,
        login: user.login,
        nomComplet: user.nomComplet,
        role: user.role,
        createdAt: user.createdAt,
        LikedBouquets: likedBouquets,
        Transactions: transactions
      },
      stats: {
        totalTransactions,
        totalSpent,
        totalLikes
      }
    });
  } catch (error) {
    console.error("Erreur getUserProfile:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      message: "Erreur interne", 
      error: error.message 
    });
  }
};

// Récupérer les bouquets likés
exports.getLikedBouquets = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const bouquets = await db.Bouquet.findAll({
      include: [{
        model: db.User,
        as: 'Likers',
        where: { id: userId },
        attributes: [],
        through: { attributes: ['createdAt'] }
      }]
    });
    
    res.json(bouquets);
  } catch (error) {
    console.error("Erreur getLikedBouquets:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Liker un bouquet
exports.likeBouquet = async (req, res) => {
  try {
    const { userId, bouquetId } = req.body;
    
    const existingLike = await db.Like.findOne({
      where: { UserId: userId, BouquetId: bouquetId }
    });
    
    if (existingLike) {
      return res.status(400).json({ message: "Déjà liké" });
    }
    
    await db.Like.create({ UserId: userId, BouquetId: bouquetId });
    
    res.json({ message: "Bouquet liké avec succès" });
  } catch (error) {
    console.error("Erreur likeBouquet:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Unlike un bouquet
exports.unlikeBouquet = async (req, res) => {
  try {
    const { userId, bouquetId } = req.body;
    
    const deleted = await db.Like.destroy({
      where: { UserId: userId, BouquetId: bouquetId }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: "Like introuvable" });
    }
    
    res.json({ message: "Like supprimé" });
  } catch (error) {
    console.error("Erreur unlikeBouquet:", error);
    res.status(500).json({ message: "Erreur interne" });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { nomComplet, password } = req.body;

    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (nomComplet) user.nomComplet = nomComplet;
    if (password) user.password = password;

    await user.save();

    res.json({ 
      message: "Profil mis à jour",
      user: {
        id: user.id,
        login: user.login,
        nomComplet: user.nomComplet
      }
    });
  } catch (error) {
    console.error("Erreur updateProfile:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};