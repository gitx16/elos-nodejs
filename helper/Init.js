var os = require('os');
var Global = require('./Global');

//获取ip地址
var ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            return;
        }
        if (alias >= 1) {
            console.log(ifname + ':' + alias, iface.address);
        } else {
            console.log(ifname, iface.address);
        }
        var indexIp = "192.168.1.";
        if(Global.env=="dev"){
            indexIp = "192.168.1.";
        }else if(Global.env=="prod"||Global.env=="lan"){
            indexIp = "192.168.";
        }
        if(iface.address.indexOf(indexIp)!=-1){
            Global.serverIp = iface.address;
        }
    });
});


module.exports = null;
