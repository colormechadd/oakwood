var pg = require('pg');
var events = require('events');
var util = require('util');
var _ = require('underscore');
var ModelUtil = require('./ModelUtil');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/oakwood';

var PoolModel = function(tournament_id) {
    this.tournament_id = tournament_id;
    events.EventEmitter.call(this);
}
util.inherits(PoolModel, events.EventEmitter);

PoolModel.prototype.load = function(onLoad) {
    var self = this;
    pg.connect(connectionString, function(err, client, done) {
        var query = "SELECT pr.pool_id, pr.racer_id FROM pool p JOIN pool_racer pr ON p.pool_id = pr.pool_id WHERE p.tournament_id = $1";
        client.query(query, [self.tournament_id], function(err, result) {
            done();
            var pools = {};
            _.each(result.rows, function() {
                if (!_.has(pools, this.pool_id)) pools[this.pool_id] = [];
                pools[this.pool_id].push(this.racer_id);
            });

            onLoad(pools);
        });
    });
};

PoolModel.prototype.save = function(pools, onComplete) {
    var self = this;

    // clean out existing pools
    var cleanQueries = [
        ["DELETE FROM pool_racer pr USING pool p WHERE p.pool_id = pr.pool_id AND p.tournament_id = $1", [self.tournament_id]],
        ["DELETE FROM pool WHERE tournament_id = $1", [self.tournament_id]]
    ];

    var createQueries = [];
    _.each(pools, function(pool_members, index) {
        createQueries.push(["INSERT INTO pool (pool_id, tournament_id) VALUES ($1, $2)", [index, self.tournament_id]]);
        _.each(pool_members, function(racer) {
            createQueries.push(["INSERT INTO pool_racer (pool_id, racer_id) VALUES ($1, $2)", [index, racer.racer_id]]);
        });
    });

    ModelUtil.execute(cleanQueries.concat(createQueries), onComplete);
};

module.exports = PoolModel;