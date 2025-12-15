module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Like", {
    // Table de jonction entre User et Bouquet
    // Les clés étrangères UserId et BouquetId seront automatiquement créées
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    updatedAt: false
  });
};