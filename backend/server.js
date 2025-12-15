const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();

// Configuration CORS AVANT les autres middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des sessions
app.use(session({
  secret: "votre-secret-key-ici-changez-en-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 heures
    httpOnly: true,
    secure: false, // Mettre à true en production avec HTTPS
    sameSite: 'lax'
  }
}));

let requestCount = 0;

const db = require("./models");

// Synchronisation de la base de données
db.sequelize.sync({ alter: true })
  .then(() => console.log("📦 Base SQLite synchronisée"))
  .catch(err => console.error(err));

// Import des routes
const bouquetRoutes = require("./routes/bouquet.routes");
const flowerRoutes = require("./routes/flower.routes");
const userRoutes = require("./routes/user.routes");
const backofficeRoutes = require("./routes/backoffice.routes");
const transactionRoutes = require("./routes/transaction.routes");
const cartRoutes = require("./routes/cart.routes");

// Middleware pour logger les requêtes (debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  requestCount++;
  next();
});

// Utilisation des routes
app.use("/api/bouquets", bouquetRoutes);
app.use("/api/fleurs", flowerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/backoffice", backofficeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cart", cartRoutes);

// Afficher le nombre de requêtes chaque minute
setInterval(() => {
  console.log(`🌐 Requêtes reçues cette minute : ${requestCount}`);
  requestCount = 0;
}, 60000);

// Route de test pour vérifier la session
app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ 
      loggedIn: true, 
      user: req.session.user,
      bouquetEnCours: req.session.bouquetEnCours || null
    });
  } else {
    res.json({ loggedIn: false });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Serveur backend sur http://localhost:${PORT}`));