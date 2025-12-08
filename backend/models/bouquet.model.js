module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Bouquet", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    price: DataTypes.FLOAT
  });
};
