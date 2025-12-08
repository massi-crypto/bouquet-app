const db = require("./models");

async function seed() {
  await db.sequelize.sync({ alter: true });

  // 🔹 Insérer quelques fleurs
  const rose = await db.Flower.create({
    name: "Rose",
    description: "Rose rouge fraîche",
    unitPrice: 100,
  });

  const tulipe = await db.Flower.create({
    name: "Tulipe",
    description: "Tulipe parfumée",
    unitPrice: 80,
  });

  // 🔹 Insérer un bouquet
  const bouquet1 = await db.Bouquet.create({
    name: "Bouquet de Tunis",
    description: "Jasmins, roses et tulipes",
    price: 1500,
    image: "/images/bouquetTunis.jpg",
  });

  // 🔹 Ajouter des fleurs au bouquet (relation N-N)
  await db.BouquetFlower.create({
    BouquetId: bouquet1.id,
    FlowerId: rose.id,
    quantity: 5,
  });

  await db.BouquetFlower.create({
    BouquetId: bouquet1.id,
    FlowerId: tulipe.id,
    quantity: 3,
  });

  console.log("🌼 Données insérées avec succès !");
  process.exit();
}

seed();
