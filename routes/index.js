var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res) {
    var menu = [
        {
            id:"session",
            icon:"chat",
            className:"session",
            label:"会话",
            link:"#/session"
        },
        {
            id:"linkman",
            icon:"contacs",
            className:"linkman",
            label:"识别",
            link:"#/linkman"
        },
        {
            id:"group",
            icon:"group",
            className:"group",
            label:"群组",
            link:"#/group"
        }
    ];
    res.render('index', { menu: menu});
});

module.exports = router;
