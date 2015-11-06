var express = require('express');
var router = express.Router();
var Global = require("../helper/Global");

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
    var resServer = "";
    if(Global.env=="dev"){
        resServer  = "http://res.tourerp.cn";
    }else if(Global.env=="prod"){
        resServer  = "http://res.x16.com";
    }
    res.render('index', { menu: menu,resServer:resServer});
});

module.exports = router;
