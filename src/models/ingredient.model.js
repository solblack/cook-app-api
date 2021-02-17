const { Model } = require("sequelize");

class Ingredient extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER(11),
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },

      {
        tableName: "ingredients",
        timestamps: false,
        underscored: true,
        sequelize,
      }
    );
  }

}

module.exports = Ingredient;
