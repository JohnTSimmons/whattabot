module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Topics', {
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};