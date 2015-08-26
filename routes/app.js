var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/vote/:id', function (req, res) {
    res.render('app/vote', { voteId: req.params.id });
});
router.get('/activity/:id', function (req, res) {
    res.render('app/activity', { activityId: req.params.id });
});
router.get('/plan_nodes/:id', function (req, res) {
    res.render('app/plan_nodes', { nodeId: req.params.id });
});
router.get('/work_view/:id', function (req, res) {
    res.render('app/work_view', { workId: req.params.id });
});
router.get('/analyze/:id', function (req, res) {
    res.render('app/work_view', { workId: req.params.id });
});
module.exports = router;
