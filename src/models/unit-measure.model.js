const { Model } = require('sequelize');

class UnitMeasure extends Model {

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
                    allowNull: false
                },
                abbreviation: {
                    type: DataTypes.STRING(45),
                    allowNull: false
                }
            },
            // options {}
            {
                tableName: "unit_measures",
                timestamps: false,
                sequelize
            }
        );
    }

}

module.exports = UnitMeasure;