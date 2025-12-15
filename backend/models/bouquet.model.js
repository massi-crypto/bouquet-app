module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Bouquet", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'likes_count'
    }
  });
};