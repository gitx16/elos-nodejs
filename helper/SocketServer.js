var SocketServer = function(data,stat){
    var net = require("net");
    var Constants = require("./Constants");
    var Global = require("./Global");
    var server = net.createServer();
    var ProtoBuf = require("protobufjs");
    var path = require("path");

    var builder = ProtoBuf.loadProtoFile(path.join(__dirname, '../pb')+"/cmdSign.proto");
    var pb = builder.build("pb");
    var CmdSignPb = pb.CmdSignPb;

    server.on('connection',function(client){
        client.on('data',function(data){
            var subData = data.slice(0, data.length-5);
            var signPb = CmdSignPb.decode(subData);
            var userId = signPb.msg;
            var socketId = Global.userSocketMap[userId];
            if(socketId){
                Global.io.to(socketId).emit("notify",{reqCode:signPb.reqCode});
            }
        });
    });
    server.listen(Constants.SOCKET_SERVER_PORT);
    this.getIpPort = function(){
        return Global.serverIp+":"+Constants.SOCKET_SERVER_PORT;
    }
};

module.exports = new SocketServer();
