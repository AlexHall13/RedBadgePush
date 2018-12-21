require('dotenv').config();

var express = require('express');
var app = express();

var sequelize = require('./db');

var bodyParser = require('body-parser');

var auth = require('./controllers/authcontrollers');
var entry = require('./controllers/entrycontrollers')

sequelize.sync ()


app.use(bodyParser.json());
app.use(require('./middleware/headers'));

app.use('/user', auth);
app.use('/entry', entry);
app.use(require('./middleware/validate-session'));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`)
})
