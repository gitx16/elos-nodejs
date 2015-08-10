var SocketClient = function(data,stat){
    var net = require("net");
    var clientMap = {};
    var Client = function(){
        var self = this;
        var client = new net.Socket();
        var ip,port;
        this.connect = function(ip,port){
            self.ip = ip;
            self.port = port;
            client.connect(port,ip,function()
            {
                console.log("socket connect");
            });
            client.on("data",function(buf)
            {
                console.log("socket data");
            });
            client.on("close",function()
            {
                delete clientMap[self.ip+":"+self.port];
                console.log("socket closed!");
            });
            client.on("error",function(e)
            {
                delete clientMap[self.ip+":"+self.port];
                console.log("socket error");
            });
        };
        this.send = function(buffer){
            if(buffer){
                client.write(buffer);
            }
        };
    };
    this.getClient = function(ip,port){
        if(!clientMap[ip+":"+port]){
            var client = new Client();
            client.connect(ip,port);
            clientMap[ip+":"+port] = client;
            return client;
        }else{
            return clientMap[ip+":"+port];
        }
    }
};

module.exports = new SocketClient();
