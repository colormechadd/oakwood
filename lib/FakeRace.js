var events = require('events');

function random (low, high) {
    return Math.random() * (high - low) + low;
}

function Race(car1, car2) {
    this.car1 = {
        name: car1,
        elapsed: null
    };
    this.car2 = {
        name: car2,
        elapsed: null
    };
    this.startTime = null;
    events.EventEmitter.call(this);

    this.start = function() {
        // do work
        this.emit('started');
        this.startTime = new Date().getTime();

        var self = this;

        setTimeout(function() {
            self.recordFinish(self.car1);
        }, random(1000, 4000));

        setTimeout(function() {
            self.recordFinish(self.car2);
        }, random(1000, 4000));


    };

    this.recordFinish = function(car) {
        car.elapsed = new Date().getTime() - this.startTime;
        this.emit('finish', car);


        if (this.car1.elapsed !== null && this.car2.elapsed !== null) {
            this.emit('complete', this.car1, this.car2);
        }
    }
}

Race.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Race;