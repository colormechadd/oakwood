var pg = require('pg');
var events = require('events');
var util = require('util');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/oakwood';

var RacerModel = function(tournament_id) {
    this.tournament_id = tournament_id;
    events.EventEmitter.call(this);
}
util.inherits(RacerModel, events.EventEmitter);

RacerModel.prototype.load = function(onLoad) {
    var self = this;
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query({
            text:  " SELECT r.racer_id, "+
                   "        r.racer_name, "+
                   "        r.car_name, "+
                   "        r.status, "+
                   "        tr.seed, "+
                   "        qlap.elapsed_time as qualifying_time, "+
                   "        AVG(alap.elapsed_time) as avg_lap_time "+
                   " FROM racer r "+
                   "   JOIN tournament_racer tr ON "+
                   "     tr.racer_id = r.racer_id "+
                   "   LEFT JOIN lap qlap ON "+
                   "     qlap.lap_id = tr.qualifying_lap_id "+
                   "   LEFT JOIN lap alap ON "+
                   "     alap.racer_id = r.racer_id"+
                   "   LEFT JOIN race c ON "+
                   "     c.lap1_id = alap.lap_id OR c.lap2_id = alap.lap_id "+
                   " WHERE tr.tournament_id = $1 "+
                   " GROUP BY 1,2,3,4,5,6",
            values: [self.tournament_id]
        }, function(err, result) {
            done();
            onLoad(result.rows);
        });
    });
};

RacerModel.prototype.create = function(racer_name, car_name, onComplete) {
    var self = this;
    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO racer (racer_name, car_name, status) VALUES ($1, $2, $3) RETURNING racer_id", [racer_name, car_name, 'active'], function(err, result) {
            var racer_id = result.rows[0].racer_id;
            client.query("INSERT INTO tournament_racer (tournament_id, racer_id) VALUES ($1, $2)", [self.tournament_id, racer_id], function(err, result) {
                done();
                onComplete(racer_id);
            });
        });
    });
};

RacerModel.prototype.update = function(racer_id, fields, onComplete) {
    pg.connect(connectionString, function(err, client, done) {
        var fields = [];
        var replacements = [];
        var i = 1;
        Object.keys(req.body).forEach(function(key) {
            fields.push(key+' = $'+i);
            replacements.push(req.body[key]);
            i = i+1;
        });
        replacements.push(path.basename(req.url));

        client.query(
            "UPDATE racer SET "+fields.join(',')+" WHERE racer_id = $"+i,
            replacements,
            function() {
                done();
                onComplete();
            }
        );
    });
};

module.exports = RacerModel;