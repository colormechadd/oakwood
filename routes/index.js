var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        pageTitle: 'test'
    });
});

router.get('/racers', function(req, res, next) {
    res.render('racers', {
        pageTitle: 'Oakwood Derby Racers'
    });
});

router.get('/racers/new', function(req, res, next) {
    res.render('new_racer', {
        pageTitle: 'Add new racer'
    });
});

module.exports = router;