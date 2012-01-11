cluster = require('cluster')
mongodb = require('mongodb')
mongodb_server = new mongodb.Server("127.0.0.1", 27017, {}) #{10.60.38.69}

module.exports = class MailorServ

  constructor: (@host, @port) ->
    @app = require('express').createServer();
    @set_routes()
    cluster(@app).listen(@port, @host)
    # process.on "uncaughtException", (exception) ->
    #   console.error "uncaught exception: #{exception}!"

  set_routes: () ->
    @app.get "/", @hello_world
    @app.post "/:app", @mail

  mail: (req, res) ->
    req.on "data", (chunk) ->
      body += chunk
      # console.log "body"
      # console.log "----"
      # console.log body

      # send res
      res.send "success"

        # compile email into sendable source
      email = body.replace(/\\"/g, "\"") # unescaple the " (we may need to do more unescaping)
      emailArray = email.split('\\n')
      # console.log emailArray
      options = {}
      options.headers = {}
      options.pre_encoded = true
      completeOptions = false
      body = ""
      i = 0
      while i < emailArray.length
        unless completeOptions
          if emailArray[i] is ""
            completeOptions = true
          else if emailArray[i].match("To")
            options.to = emailArray[i].split(": ")[1]
          else if emailArray[i].match("Subject")
            options.subject = emailArray[i].split(": ")[1]
          else if emailArray[i].match("From")
            options.sender = emailArray[i].split(": ")[1]
          else
            options.headers[emailArray[i].split(": ")[0]] = emailArray[i].split(": ")[1]
        else
          body = body + emailArray[i] + "\n"
        i++
      options.body = body
      options.html = body

      # console.log options

        # get smtp cred from mongo
      new mongodb.Db("pagoda_development", mongodb_server).open (error, client) ->
        console.log "database: #{error}"  if error
        # console.log client
        new mongodb.Collection(client, "components").find(_type: "SmtpComponent", app_id: new client.bson_serializer.ObjectID(req.params.app)).nextObject (err, smtp) ->
          console.log "Error: #{err}" if err

          if smtp
            nodemailer = require('nodemailer')
            nodemailer.SMTP = {
              host: smtp.host,
              port: smtp.port,
              ssl: smtp.ssl,
              use_authentication: true,
              user: smtp.user,
              pass: smtp.pass
            }

            nodemailer.send_mail options, (error, success) ->
              return console.log("Message " + (if success? then "sent" else "failed"))
              console.log success
              console.log error  if error

            console.log options
          else
            console.log "could not find smtp info"

  hello_world: (req, res) ->
    res.send "hello BIG world"
