const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize, DataTypes) => {
    const Version = sequelize.define('version', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false, 
        },
        version: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        lastUpdate: {
            type: DataTypes.DATE(),
            allowNull: false, 
        },
        details: DataTypes.STRING,
    }, {
        tableName: 'Version',
        freezeTableName: true,  //disable the modification of tablenames into plural
        timestamps: false       // don't add the timestamp attributes (updatedAt, createdAt)
    });

    // Class Method
    Version.associate = function (models) {
    };

    return Version;
};
