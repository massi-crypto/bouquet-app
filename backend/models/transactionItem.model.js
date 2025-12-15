module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TransactionItem", {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    price: {
      type: DataTypes.FLOAT
    }
  });
};