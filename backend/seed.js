const db = require("./models");

async function seed() {
  await db.sequelize.sync({ alter: true });

  // Vérifier si des données existent déjà
  const existingFlowers = await db.Flower.count();
  if (existingFlowers > 0) {
    console.log("🌼 Données déjà présentes, pas d'insertion.");
    process.exit();
  }

  console.log("🌱 Insertion des données de test...");

  // === FLEURS ===
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

  const jasmin = await db.Flower.create({
    name: "Jasmin",
    description: "Jasmin blanc délicat",
    unitPrice: 60,
  });

  const orchidee = await db.Flower.create({
    name: "Orchidée",
    description: "Orchidée exotique",
    unitPrice: 150,
  });

  // === BOUQUETS ===
  const bouquet1 = await db.Bouquet.create({
    name: "Bouquet de Tunis",
    description: "Jasmins, roses et tulipes",
    price: 1500,
    image: "/images/bouquetTunis.jpg",
  });

  const bouquet2 = await db.Bouquet.create({
    name: "Bouquet Romantique",
    description: "Roses rouges et orchidées",
    price: 2500,
    image: "/images/bouquetRomantique.jpg",
  });

  const bouquet3 = await db.Bouquet.create({
    name: "Bouquet Printemps",
    description: "Tulipes multicolores",
    price: 1200,
    image: "/images/bouquetPrintemps.jpg",
  });

  // === COMPOSITION DES BOUQUETS ===
  await db.BouquetFlower.bulkCreate([
    { BouquetId: bouquet1.id, FlowerId: rose.id, quantity: 5 },
    { BouquetId: bouquet1.id, FlowerId: tulipe.id, quantity: 3 },
    { BouquetId: bouquet1.id, FlowerId: jasmin.id, quantity: 7 },
    
    { BouquetId: bouquet2.id, FlowerId: rose.id, quantity: 10 },
    { BouquetId: bouquet2.id, FlowerId: orchidee.id, quantity: 2 },
    
    { BouquetId: bouquet3.id, FlowerId: tulipe.id, quantity: 12 },
  ]);

  // === UTILISATEURS ===
  const user1 = await db.User.create({
    login: "ahmed@email.com",
    password: "123456", // En production, utiliser bcrypt
    nomComplet: "Ahmed Ben Ali"
  });

  const user2 = await db.User.create({
    login: "fatima@email.com",
    password: "123456",
    nomComplet: "Fatima Zahra"
  });

  // === LIKES ===
  await db.Like.bulkCreate([
    { UserId: user1.id, BouquetId: bouquet1.id },
    { UserId: user1.id, BouquetId: bouquet2.id },
    { UserId: user2.id, BouquetId: bouquet1.id },
  ]);

  // === TRANSACTIONS ===
  const transaction1 = await db.Transaction.create({
    UserId: user1.id,
    date: new Date(),
    total: 2700
  });

  await db.TransactionItem.bulkCreate([
    { TransactionId: transaction1.id, BouquetId: bouquet1.id, quantity: 1, price: 1500 },
    { TransactionId: transaction1.id, BouquetId: bouquet3.id, quantity: 1, price: 1200 },
  ]);

  console.log("🌼 Données insérées avec succès !");
  console.log("📊 Résumé:");
  console.log(`   - ${await db.Flower.count()} fleurs`);
  console.log(`   - ${await db.Bouquet.count()} bouquets`);
  console.log(`   - ${await db.User.count()} utilisateurs`);
  console.log(`   - ${await db.Like.count()} likes`);
  console.log(`   - ${await db.Transaction.count()} transactions`);
  
  process.exit();
}

seed();