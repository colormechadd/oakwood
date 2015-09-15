var pg = require('pg');
var events = require('events');
var util = require('util');
var _ = require('underscore');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/oakwood';

var PoolUtil = {
    execute: function(queries, onComplete) {
        var client = new pg.Client(connectionString);

        client.connect(function(err) {
            var results = [];

            function run() {
                if (results.length == queries.length) {
                    client.end();
                    onComplete(results);
                }
                else {
                    var query = queries[results.length];
                    var curResults = [];

                    if (_.isArray(query)) {
                        console.log(query[0], query[1]);
                        var query = client.query(query[0], query[1]);
                    }
                    else if (_.isObject(query)) {
                        var query = client.query(query.sql, query.parameters);
                    }
                    else {
                        var query = client.query(query);
                    }
                    query.on('error', function(error) {
                        console.log('Error:', error);
                    });
                    query.on('row', function(row) {
                        curResults.push(row);
                    });

                    query.on('end', function() {
                        results.push(curResults);
                        run();
                    });
                }
            }
            run();
        });
    }
};

module.exports = PoolUtil;