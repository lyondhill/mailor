(function() {
  var MailorServ, cluster, mongobd_server, mongodb;
  cluster = require('cluster');
  mongodb = require('mongodb');
  mongobd_server = new mongodb.Server("10.60.38.69", 27017, {});
  module.exports = MailorServ = (function() {
    function MailorServ(host, port) {
      this.host = host;
      this.port = port;
      this.app = require('express').createServer();
      this.set_routes();
      cluster(this.app).listen(this.port, this.host);
      process.on("uncaughtException", function(exception) {
        return console.error("uncaught exception: " + exception + "!");
      });
    }
    MailorServ.prototype.set_routes = function() {
      this.app.get("/", this.hello_world);
      return this.app.post("/:app", this.mail);
    };
    MailorServ.prototype.mail = function(req, res) {
      console.log(req.params);
      console.log(req.headers.bundlie);
      return res.send("success");
    };
    MailorServ.prototype.hello_world = function(req, res) {
      res.header('Connection', 'close');
      return res.send("hello BIG world");
    };
    return MailorServ;
  })();
}).call(this);
