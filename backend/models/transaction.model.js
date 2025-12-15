module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Transaction", {
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    }
  });
};