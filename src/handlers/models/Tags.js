const { Sequelize, DataTypes } = require('sequelize');

/**
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => sequelize.define('tags', {
    name: {
        type: DataTypes.STRING,
        unique: true,
    },
    description: DataTypes.TEXT,
    username: DataTypes.STRING,
    usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    staff_only: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});