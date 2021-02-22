const { Model } = require('sequelize');

class Recipe extends Model {

    static init(sequelize, DataTypes) {
        return super.init(
            // columns data {}
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                },
                title: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false
                }
            },
            // options {}
            {
                tableName: "recipes",
                timestamps: false,
                sequelize
            }
        );
    }

    static associate(models) {
        models.Recipe.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user"
        });  
        models.Recipe.hasMany(models.RecipeIngredient, {
            foreignKey: "recipe_id",
            as: "ingredients"
        }); 
    }

}

module.exports = Recipe;