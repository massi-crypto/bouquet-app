module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    login: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomComplet: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};