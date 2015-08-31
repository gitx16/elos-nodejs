var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/votes', function (req, res) {
    res.render('app/vote');
});
router.get('/activities', function (req, res) {
    res.render('app/activity');
});
router.get('/notices', function (req, res) {
    res.render('app/notice');
});
router.get('/plan_nodes/:id', function (req, res) {
    res.render('app/plan_nodes', { nodeId: req.params.id });
});
module.exports = router;
