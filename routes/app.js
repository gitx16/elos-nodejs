var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/vote/:id', function (req, res) {
    res.render('app/vote', { voteId: req.params.id });
});
router.get('/activity/:id', function (req, res) {
    res.render('app/activity', { activityId: req.params.id });
});

module.exports = router;
