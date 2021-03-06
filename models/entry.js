module.exports = function (sequelize, DataTypes) {
    const EntryFacet = sequelize.define('entry', {
        userId: {
            type: DataTypes.INTEGER,
            allownull: false,
        },
        title: {
            type: DataTypes.STRING,
            allownull: false,
        },
        content: {
            type: DataTypes.STRING,
            allownull: false,
        },
        dateAdded: {
            type: DataTypes.STRING,
            allownull: false,
        }
    })
    EntryFacet.associate = models => {
        EntryFacet.belongsTo(models, {foreignKey: ['user']})
     }
    return EntryFacet
}