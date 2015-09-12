var _ = require('underscore');

var Tournament = {
    DEFAULT_MAX_PER_POOL: 5,

    PoolEntrant: function(racer_id, qualifying_time) {
        this.racer_id = racer_id;
        this.qualifying_time = qualifying_time;
        this.seed = null;
    },
    DEEntrant: function(racer_id, wins, losses, times) {
        this.racer_id = racer_id;
        this.wins = wins;
        this.losses = losses;
        this.times = times;
        this.seed = null;
    },

    CreatePools: function(entrants, maxPerPool) {
        if (maxPerPool === undefined) {
            maxPerPool = Tournament.DEFAULT_MAX_PER_POOL;
        }

        // sort by qualifying time and assign seeding (first randomize so ties are randomly ordered)
        entrants = _.shuffle(entrants);
        entrants = _.sortBy(entrants, 'qualifying_time');

        // determine number of pools
        var numPools = Math.ceil(entrants.length / maxPerPool);
        var pools = _(numPools).times(function() { return []; });
        _.each(entrants, function(entry, index) {
            entry.seed = index+1;
            pools[index%numPools].push(entry);
        });

        return pools;
    },

    CreateDE: function(entrants) {
        // rank by wins, losses, then average time
        entrants = _.sortBy(entrants, function(e) { return [-e.wins, e.losses, _.reduce(e.times, function(memo, num) { return memo+num; })/e.times.length]; });
        _.each(entrants, function(entry, index) {
            entry.seed = index+1;
        });
    }
};

module.exports = Tournament;

if (require.main === module) {
    //var entries = _(23).times(function(n) { return new Tournament.PoolEntrant(n, n); });
    //var pools = Tournament.CreatePools(entries);
    //console.log(pools);

    var entries = [
        new Tournament.DEEntrant(1, 5, 5, [2, 3, 4]),
        new Tournament.DEEntrant(1, 5, 6, [2, 3, 4]),
        new Tournament.DEEntrant(1, 5, 4, [2, 3, 4]),
        new Tournament.DEEntrant(1, 5, 4, [4, 5, 6]),
        new Tournament.DEEntrant(1, 5, 4, [1, 2, 3]),
        new Tournament.DEEntrant(1, 4, 5, [2, 3, 4]),
        new Tournament.DEEntrant(1, 6, 5, [2, 3, 4]),
        new Tournament.DEEntrant(1, 9, 5, [2, 3, 4]),
        new Tournament.DEEntrant(1, 3, 5, [2, 3, 4])

    ];
    Tournament.CreateDE(entries);
}
