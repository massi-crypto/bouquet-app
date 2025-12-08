module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Flower", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    unitPrice: DataTypes.FLOAT
  });
};
