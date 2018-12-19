require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});
sequelize.authenticate().then(
    function () {
        console.log('Connected to Postgres Database');
    },
    function (err) {
        console.log(err)
    }
);

const User = sequelize.import('./models/auth');
const EntryFacet = sequelize.import('./models/entry');

User.hasMany(EntryFacet)

EntryFacet.belongsTo(User)

module.exports = sequelize;