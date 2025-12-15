const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Chargement des modèles
db.Flower = require("./flower.model.js")(sequelize, Sequelize);
db.Bouquet = require("./bouquet.model.js")(sequelize, Sequelize);
db.BouquetFlower = require("./bouquetflower.model.js")(sequelize, Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Like = require("./like.model.js")(sequelize, Sequelize);
db.Transaction = require("./transaction.model.js")(sequelize, Sequelize);
db.TransactionItem = require("./transactionItem.model.js")(sequelize, Sequelize);

// === ASSOCIATIONS ===

// Association Bouquet <-> Flower (Many-to-Many)
db.Bouquet.belongsToMany(db.Flower, { through: db.BouquetFlower });
db.Flower.belongsToMany(db.Bouquet, { through: db.BouquetFlower });

// Association User <-> Bouquet via Likes (Many-to-Many)
db.User.belongsToMany(db.Bouquet, { through: db.Like, as: "LikedBouquets" });
db.Bouquet.belongsToMany(db.User, { through: db.Like, as: "Likers" });

// Association User <-> Transaction (One-to-Many)
db.User.hasMany(db.Transaction);
db.Transaction.belongsTo(db.User);

// Association Transaction <-> Bouquet via TransactionItem (Many-to-Many)
db.Transaction.belongsToMany(db.Bouquet, { through: db.TransactionItem });
db.Bouquet.belongsToMany(db.Transaction, { through: db.TransactionItem });

module.exports = db;