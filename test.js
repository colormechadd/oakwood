var Race = require('./lib/Race.js');

var race1 = new Race('Chad', 'Kristin');
var winner = null;

/*
race1.on('complete', function(car1, car2) {
    var order = [car1,car2];
    order.sort(function(a,b) {
        return a.elapsed - b.elapsed;
    });

    console.log(order[0].name, 'wins!');
    order.forEach(function(car) {
        console.log(car.name, car.elapsed/1000);
    });
});
*/

race1.on('started', function() {
    console.log('And they\'re off!');
});
race1.on('finish', function(car) {
    if (winner === null) {
        console.log("We have a winner!", car.name, "finishes in a mere", car.elapsed/1000, "seconds!");
        winner = car;
    }
    else {
        console.log(car.name, "puts in a loser effort with a time of", car.elapsed/1000, "seconds.");
    }
});

race1.start();