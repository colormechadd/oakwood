var express = require('express');
var router = express.Router();

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/oakwood';

router.get('/racers', function(req, res) {
    var result = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT racer_id, racer_name, car_name, status, img FROM racer");

        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(result);
        });
    });
});

router.post('/racers/create', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        // SQL Query > Select Data
        var query = client.query("INSERT INTO racer (racer_name, car_name, status) VALUES ($1, $2, $3)", [req.body.racer_name, req.body.car_name, 'active'], function() {
            client.end();
            return res.json();
        });
    });
});

module.exports = router;
