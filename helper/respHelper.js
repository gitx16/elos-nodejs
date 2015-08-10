module.exports = function(data,stat){
    var resp = {
        stat:stat||"OK",
        data:data
    };
    this.getResp = function(){
        return resp;
    }
    this.setErr = function(err){
        resp.stat = "ERROR";
        resp.errors = err.message;
    }
};
