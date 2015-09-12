var _ = require('underscore');

var Tournament = {
    DEFAULT_MAX_PER_POOL: 5,

    PoolEntrant: function(racer_id, qualifying_time) {
        this.racer_id = racer_id;
        this.qualifying_time = qualifying_time;
        this.seed = null;
    },
    BracketEntrant: function(racer_id, wins, losses, times) {
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

    CreateBracket: function(entrants) {
        // rank by wins, losses, then average time
        entrants = _.sortBy(entrants, function(e) { return [-e.wins, e.losses, _.reduce(e.times, function(memo, num) { return memo+num; })/e.times.length]; });
        _.each(entrants, function(entry, index) {
            entry.seed = index+1;
        });

        // determine the number of rounds
        var rounds = 0;
        while(Math.pow(2, rounds) < entrants.length) ++rounds;

        // recursively build empty bracket
        function buildTree(n, topSeed) {
            if (n > rounds) return null;
            var bottomSeed = Math.pow(2, n) - (topSeed+1);

            var parent1 = buildTree(n+1, topSeed);
            var parent2 = buildTree(n+1, bottomSeed);

            var entrant1 = null;
            var entrant2 = null;
            if (parent1 === null) {
                entrant1 = topSeed < entrants.length ? entrants[topSeed] : null;
                entrant2 = bottomSeed < entrants.length ? entrants[bottomSeed] : null;
            }

            return {
                round: n,
                parent1: parent1,
                parent2: parent2,
                entrant1: entrant1,
                entrant2: entrant2
            }
        }
        return buildTree(1, 0);
    }
};

module.exports = Tournament;

if (require.main === module) {
    //var entries = _(23).times(function(n) { return new Tournament.PoolEntrant(n, n); });
    //var pools = Tournament.CreatePools(entries);
    //console.log(pools);

    var entries = [
        new Tournament.BracketEntrant(1, 5, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(2, 5, 6, [2, 3, 4]),
        new Tournament.BracketEntrant(3, 5, 4, [2, 3, 4]),
        new Tournament.BracketEntrant(4, 5, 4, [4, 5, 6]),
        new Tournament.BracketEntrant(5, 5, 4, [1, 2, 3]),
        new Tournament.BracketEntrant(6, 4, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(7, 6, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(8, 9, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(9, 9, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(10, 9, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(11, 9, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(12, 9, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(13, 9, 5, [2, 3, 4]),
        new Tournament.BracketEntrant(14, 9, 5, [2, 3, 4])

    ];
    var bracket = Tournament.CreateBracket(entries);
}
