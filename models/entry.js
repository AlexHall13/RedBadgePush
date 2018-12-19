module.exports = function (sequelize, DataTypes) {
    const EntryFacet = sequelize.define('entry', {
        title: {
            type: DataTypes.STRING,
            allownull: false,
        },
        content: {
            type: DataTypes.STRING,
            allownull: false,
        },
        dataAdded: {
            type: DataTypes.STRING,
            allownull: false,
        }
    })
    EntryFacet.associate = models => {
        EntryFacet.belongsTo(models, {foreignKey: ['user']})
     }
    return EntryFacet
}