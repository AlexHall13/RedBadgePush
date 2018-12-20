var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/auth');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var validateSession = require('../middleware/validate-session');

router.post('/signup', function (req, res) {    
    var username = req.body.user.username;
    var pass = req.body.user.password;
    var isAdmin = req.body.user.isAdmin;
    User.create({
        username: username,
        password: bcrypt.hashSync(pass, 10),
        isAdmin: isAdmin
    }).then(
        function createSuccess(user) {
            var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

            res.json({
                user: user,
                message: 'Welcome!',
                sessionToken: token
            })
        },
        function createError(err) {
            console.error(500, err.message);
        });
});

router.post('/login', function (req, res) {
    User.findOne({ where: { username: req.body.user.username } }).then(
        function (user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                    if (matches) {
                        var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                        res.json({
                            user: user,
                            message: 'Welcome Back!',
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ err: 'Not an authorized user, please try again!' })
                    }
                });
            } else {
                res.status(500).send({ err: 'Username or Password was invalid. Please try again!' })
            }
        },
        function (err) {
            res.status(501).send({ err: 'A system error has occured! Please contact the webmaster or server admin to ammend this issue!' })
        })

})

router.get('/getall', validateSession, function (req, res) {
    User.findAll()
        .then(
            function findAllSuccess(user) {
                res.status(200).json({user})
            });
});


router.put('/:id',validateSession, function (req, res) {
  const data = req.params.id;
  const username = req.body.user.username;
  const password = req.body.user.password;

    User
    .update({
      username: username,
      password:bcrypt.hashSync(password, 10)  

    },
      { where: { id: data, } }
    ).then(
      function updateSuccess(updatedUser) {
        res.json({
          updatedUser: updatedUser
        });
      },
      function updateError(err) {
        res.send(500, err.message);
      }
    )
});

router.delete("/:id",validateSession,  (req, res) =>
  User.destroy({ where: { id: req.params.id } })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(req.errors))
);


module.exports = router;