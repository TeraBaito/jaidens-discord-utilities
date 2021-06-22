const { Sequelize, DataTypes } = require('sequelize');

/**
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => sequelize.define('suggestions', {
    content: DataTypes.TEXT,
    user_id: DataTypes.STRING,
    message_id: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM,
        values: ['Pending', 'Denied', 'Approved', 'Implemented', 'Unnecessary']
    },
    reason: {
        type: DataTypes.TEXT,
        defaultValue: 'None',
        allowNull: false
    }
});