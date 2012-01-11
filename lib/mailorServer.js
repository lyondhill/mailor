(function() {
  var MailorServ, cluster, mongodb, mongodb_server;
  cluster = require('cluster');
  mongodb = require('mongodb');
  mongodb_server = new mongodb.Server("127.0.0.1", 27017, {});
  module.exports = MailorServ = (function() {
    function MailorServ(host, port) {
      this.host = host;
      this.port = port;
      this.app = require('express').createServer();
      this.set_routes();
      cluster(this.app).listen(this.port, this.host);
    }
    MailorServ.prototype.set_routes = function() {
      this.app.get("/", this.hello_world);
      return this.app.post("/:app", this.mail);
    };
    MailorServ.prototype.mail = function(req, res) {
      return req.on("data", function(chunk) {
        var body, completeOptions, email, emailArray, i, options;
        body += chunk;
        res.send("success");
        email = body.replace(/\\"/g, "\"");
        emailArray = email.split('\\n');
        options = {};
        options.headers = {};
        options.pre_encoded = true;
        completeOptions = false;
        body = "";
        i = 0;
        while (i < emailArray.length) {
          if (!completeOptions) {
            if (emailArray[i] === "") {
              completeOptions = true;
            } else if (emailArray[i].match("To")) {
              options.to = emailArray[i].split(": ")[1];
            } else if (emailArray[i].match("Subject")) {
              options.subject = emailArray[i].split(": ")[1];
            } else if (emailArray[i].match("From")) {
              options.sender = emailArray[i].split(": ")[1];
            } else {
              options.headers[emailArray[i].split(": ")[0]] = emailArray[i].split(": ")[1];
            }
          } else {
            body = body + emailArray[i] + "\n";
          }
          i++;
        }
        options.body = body;
        options.html = body;
        return new mongodb.Db("pagoda_development", mongodb_server).open(function(error, client) {
          if (error) {
            console.log("database: " + error);
          }
          return new mongodb.Collection(client, "components").find({
            _type: "SmtpComponent",
            app_id: new client.bson_serializer.ObjectID(req.params.app)
          }).nextObject(function(err, smtp) {
            var nodemailer;
            if (err) {
              console.log("Error: " + err);
            }
            if (smtp) {
              nodemailer = require('nodemailer');
              nodemailer.SMTP = {
                host: smtp.host,
                port: smtp.port,
                ssl: smtp.ssl,
                use_authentication: true,
                user: smtp.user,
                pass: smtp.pass
              };
              nodemailer.send_mail(options, function(error, success) {
                return console.log("Message " + (success != null ? "sent" : "failed"));
                console.log(success);
                if (error) {
                  return console.log(error);
                }
              });
              return console.log(options);
            } else {
              return console.log("could not find smtp info");
            }
          });
        });
      });
    };
    MailorServ.prototype.hello_world = function(req, res) {
      return res.send("hello BIG world");
    };
    return MailorServ;
  })();
}).call(this);
