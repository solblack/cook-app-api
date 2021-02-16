const { Model } = require("sequelize");

class RecipeIngredient extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER(11),
          primaryKey: true,
          autoIncrement: true,
        },
        recipe_id: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
        },
        ingredient_id: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER(11),
          allownull: false,
        },
        unit_measure_id: {
          type: DataTypes.INTEGER(11),
          allownull: false,
        },
      },

      {
        tableName: "recipes_ingredients",
        timestamps: false,
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(models) {
    models.RecipeIngredient.belongsTo(models.Recipe, {
      foreignKey: "recipe_id",
      as: "recipe",
    });
    models.RecipeIngredient.belongsTo(models.UnitMeasure, {
      foreignKey: "unit_measure_id",
      as: "unitMeasure",
    });
    models.RecipeIngredient.belongsTo(models.Ingredient, {
        foreignKey: "ingredient_id",
        as: "ingredient",
      });
  }
}

module.exports = RecipeIngredient;
