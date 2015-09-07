var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        pageTitle: 'test'
    });
});

router.get('/api', function(req, res) {
    res.json([{
        a: '1',
        b: '2'
    }, {
        a: '2',
        b: '3'
    }]);
});

module.exports = router;
