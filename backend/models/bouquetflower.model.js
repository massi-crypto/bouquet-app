module.exports = (sequelize, DataTypes) => {
  return sequelize.define("BouquetFlower", {
    quantity: DataTypes.INTEGER
  });
};
