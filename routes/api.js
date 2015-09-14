var express = require('express');
var path = require('path');
var pg = require('pg');
var config = require('../tournament_config');

var router = express.Router();
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/oakwood';

var RacerModel = require('../models/RacerModel');

router.get('/racers', function(req, res) {
    model = new RacerModel(config.tournament_id);
    model.load(function(data) {
        return res.json(data);
    });
});

// Create racer
router.post('/racers/create', function(req, res) {
    model = new RacerModel(config.tournament_id);
    model.create(req.body.racer_name, req.body.car_name, function(racer_id) {
        res.json({racer_id: racer_id});
    });
});

// Update racer
router.post(/\/racers\/\d+/, function(req, res) {
    var racer_id = path.basename(req.url);
    model = new RacerModel(config.tournament_id);
    model.update(racer_id, req.body, function() {
        res.end();
    });
});

module.exports = router;
