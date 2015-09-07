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

module.exports = router;