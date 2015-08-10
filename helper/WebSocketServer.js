var SocketClient = require("./SocketClient");
var CachedClient = require("./CachedClient");
var SocketServer = require("./SocketServer");
var Global = require("./Global");
var ProtoBuf = require("protobufjs");
var path = require("path");

var builder = ProtoBuf.loadProtoFile(path.join(__dirname, '../pb')+"/cmdSign.proto");
var pb = builder.build("pb");
var CmdSignPb = pb.CmdSignPb;

var sendSign = function(ip,port,userId,reqCode){
    var client = SocketClient.getClient(ip,port);
    var signPb = new CmdSignPb({
        "cmdCode": "FSC_NOTIFY_POST",
        "reqCode": reqCode,
        "msg": userId+""
    });
    var buffer = signPb.encode().toBuffer();
    buffer = Buffer.concat([buffer, new Buffer("\r\n\n\n\r")]);
    client.send(buffer);
};

var func = function(server){
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        socket.on('disconnect', function () {
            var userId = Global.socketUserMap[socket.id];
            if(userId){
                delete Global.userSocketMap[userId];
                CachedClient.del("session-node-" + userId,function(e){});
            }
            delete Global.socketUserMap[socket.id];
        });
        socket.on('register', function (data) {
            Global.socketUserMap[socket.id] = data.id;
            Global.userSocketMap[data.id] = socket.id;
            CachedClient.set("session-node-" + data.id, SocketServer.getIpPort(),{ flags: 0, exptime: 0},function(err, status){
            });
        });
        socket.on("notify", function (data) {
            data.userIdArray.forEach(function (userId) {
                var key = "session-app-"+userId;
                CachedClient.get(key, function (err, obj) {
                    if(obj&&obj[key]){
                        var ipPort = obj[key].split(":");
                        sendSign(ipPort[0],ipPort[1],userId,data.reqCode);
                    }
                    key = "session-node-"+userId;
                    CachedClient.get(key,function(err, obj){
                        if(obj&&obj[key]){
                            var ipPort = obj[key].split(":");
                            if(ipPort[0]==Global.serverIp){
                                var socketId = Global.userSocketMap[userId];
                                if(socketId){
                                    Global.io.to(socketId).emit("notify",{reqCode:data.reqCode});
                                }
                            }else{
                                sendSign(ipPort[0],ipPort[1],userId,data.reqCode);
                            }

                        }
                    });
                });
            });

        })
    });
    Global.io = io;
};

module.exports = func
