const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); 



let requestCount = 0;


const db = require("./models");

// IMPORTANT : ajouter { alter: true } pour ne rien perdre
db.sequelize.sync({ alter: true })
  .then(() => console.log("📦 Base SQLite synchronisée"))
  .catch(err => console.error(err));
  



// Import des routes MVC
const bouquetRoutes = require("./routes/bouquet.routes");
const flowerRoutes = require("./routes/flower.routes");

// Utilisation des routes
app.use("/api/bouquets", bouquetRoutes);
app.use("/api/fleurs", flowerRoutes);


setInterval(() => {
  console.log(`🌐 Requêtes reçues cette minute : ${requestCount}`);
  requestCount = 0; 
}, 60000);


app.post("/like", (req, res) => {
  const id = parseInt(req.query.id);
  console.log(`💖 Like reçu pour le bouquet ID = ${id}`);
  res.json({ message: "Like enregistré avec succès !" });
});


app.listen(5000, () => console.log("✅ Serveur backend sur http://localhost:5000"));
