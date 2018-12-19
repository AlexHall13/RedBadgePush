var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var EntryFacet = sequelize.import('../models/entry');

router.post('/createnew', function (req, res) {
    EntryFacet.create({
       userId: req.user.id,
       title: req.body.entry.title,
       content: req.body.entry.content,
       dateAdded: req.body.entry.dateAdded,
    }).then(
        function createSuccess(entry) {
            res.status(200).json({
                entry: entry,
                message: 'entry successfully added to inventory.'
            })
        },
        function createError(err) {
            res.status(500).send('Something went wrong, please try again.')
        }
    );
});

router.get('/getall', function (req, res) {
    EntryFacet.findAll()
        .then(
            function findAllSuccess(entry) {
                res.status(200).json({ entry })
            }
        );
});

router.get('/byid/:id', function (req, res) {
    var data = req.params.id;
    EntryFacet.findOne({ where: { id: data } })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err }))
});

router.put('/edit/:id', function (req, res) {
    EntryFacet.update({
        title: req.body.entry.title,
       content: req.body.entry.content,
       dateAdded: req.body.entry.dateAdded,
    },
        {
            where: { id: req.params.id }
        })
        .then(data => { res.json({ editentry: data });
},
    err => {res.send(500, err.message); });
});

router.delete('/delete/:id', function (req, res) {
    EntryFacet.findById(req.params.id).then(entry => {
        if (entry === undefined) {
            res.send(500, 'entry not found, please try again.')
        } else {
            entry.destroy({
                where: {
                    id: req.params.id
                }
            }).then(
                function deleteSuccess(entry) {
                    res.status(200).json({
                        entry: entry,
                        message: 'entry removed from inventory.'
                    });
                },
                function deleteError(err) {
                    res.status(500).send('Something went wrong, please try again.')
                });
        }
    });
});

module.exports = router;