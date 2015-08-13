var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/vote', function (req, res) {
    res.render('app/vote');
});

module.exports = router;
