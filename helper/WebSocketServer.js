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

    var redis = require('redis');
    var client = redis.createClient(41512,"redis1.os");
    var RedisNotifier = require('redis-notifier');

    var eventNotifier = new RedisNotifier(redis, {
        redis : { host : 'redis1.os', port : 41512 },
        expired : true,
        evicted : true,
        logLevel : 'DEBUG' //Defaults To INFO
    });
    var typeMap = {
        1:'T',
        2:'S'
    }
    eventNotifier.on('message', function(pattern, channelPattern, emittedKey) {
        var channel = this.parseMessageChannel(channelPattern);
        var roomId = emittedKey.split("-")
        var userId = roomId.splice(3,1);
        roomId = roomId.join("-");
        var Sroom = roomId+"-S"
        var Troom = roomId+"-T"
        var UP = roomId+"-"+"UP"
        var speake = roomId+"-"+"speake"
        switch(channel.key) {
            case 'expired':
                client.hdel(Sroom,emittedKey)
                client.hdel(Troom,emittedKey)
                client.hdel(UP, emittedKey);
                client.hdel(speake, userId[0]);
                break;
            case "evicted":
                break;
            default:
        }
    });
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
        socket.on("jionRoom",function(roomId,user){
            socket.join(roomId);
            if(user){
                client.hget("picList",roomId,function(err,reply){
                    socket.emit( 'reDraw',reply);
                })
                var value = roomId+"-"+user.id
                var key = roomId+"-"+typeMap[user.type]
                var userStr = JSON.stringify(user);
                client.hset(key, value, userStr, redis.print);
            }
        })
        socket.on("leaveRoom",function(roomId){
            socket.leave(roomId);
        })
        socket.on("team",function(roomId){
            socket.broadcast.to(roomId).emit( 'team', false );
        })
        socket.on( 'reDraw', function( json, roomId) {
            socket.broadcast.to(roomId).emit( 'reDraw', json );
            client.hset("picList", roomId,json, redis.print);
        });
        socket.on( 'speakerUp', function(roomId,user) {
            var key = roomId+"-"+"UP"
            var value = roomId+"-"+user.id
            var userStr = JSON.stringify(user);
            client.hset(key, value, userStr, redis.print);
        });
        socket.on( 'speake', function(roomId,id,streamerUrl) {
            var key = roomId+"-"+"speake"
            var value = id
            client.hkeys(key, function (err, keyId) {
                if(keyId.length>0){
                    client.hdel(key, keyId[0]);
                }
                client.hset(key, value,streamerUrl, redis.print);
            })
        });
        socket.on( 'voice', function(roomId,id) {
            var key = roomId+"-"+"voice"
            var value = id
            client.hkeys(key, function (err, keyId) {
                if(keyId.length>0){
                    client.hdel(key, keyId[0]);
                }
                client.hset(key, value,roomId, redis.print);
            })
        });
        socket.on( 'speakerDown', function(roomId,id) {
            var key = roomId+"-"+"speake"
            var list = roomId+"-"+"UP"
            var value = roomId+"-"+id
            client.hdel(list, value);
            client.hdel(key, id);
        });
        socket.on( 'userList', function(roomId,user) {
            var Sroom = roomId+"-S"
            var Troom = roomId+"-T"
            var UProom = roomId+"-UP"
            var roomInfo = {}
            roomInfo.roomId = roomId;
            if(user.id){
                var name = roomId+"-"+user.id
                var userStr = JSON.stringify(user);
                client.set(name, userStr, redis.print);
                client.expire(name, 5);
                var key = roomId+"-"+typeMap[user.type]
                client.hset(key, name, userStr, redis.print);
            }else{
                client.hgetall(UProom,function(err,reply){
                    if(!reply){
                        reply = {}
                    }
                    reply.roomId = roomId;
                    socket.emit('speaklist',reply);
                })
            }
            var voice = roomId+"-"+"voice"
            client.hkeys(voice, function (err, key) {
                client.hget(voice,key[0],function(err,reply){
                    socket.emit('voice',key[0],reply);
                })
            })
            var speake = roomId+"-"+"speake"
            client.hkeys(speake, function (err, key) {
                client.hget(speake,key[0],function(err,reply){
                    socket.emit('speake',key[0],roomId,reply);
                })
            })
            client.hkeys(Sroom, function(err, reply) {
                roomInfo.sNum = reply.length;
                client.hkeys(Troom, function(err, reply) {
                    roomInfo.tNum = reply.length;
                    socket.emit('roomInfo',roomInfo);
                    socket.emit('heartbeat',"1");
                })
            })
        });
    });
    Global.io = io;
};

module.exports = func
