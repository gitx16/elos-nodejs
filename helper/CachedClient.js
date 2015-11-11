var Mc = require('mc');
var Global = require("./Global");
var client;
if(Global.env=="dev"){
    client  = new Mc.Client(["cs4.os:40242"]);
}else if(Global.env=="prod"||Global.env=="lan"){
    client  = new Mc.Client(["cs21.fsc:11211"]);
}
client.connect(function() {
    console.log("Connected to the localhost memcache on port 11211!");
});
module.exports = client;
