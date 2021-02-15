const { Model } = require('sequelize');

class User extends Model {

    static init(sequelize, DataTypes) {
        return super.init(
            // columns data {}
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false
                },
                lastname: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING(200),
                    allowNull: false
                },
                is_admin: {
                    type: DataTypes.BOOLEAN(4),
                    allowNull: false,
                    //defaultValue: false
                }
            },
            // options {}
            {
                tableName: "users",
                timestamps: false,
                underscored: true,
                sequelize
            }
        );
    }

    static associate(models) {
        models.User.hasMany(models.Recipe, {
            foreignKey: 'user_id',
            as: "recipe"
        });
    }

}

module.exports = User;