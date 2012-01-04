cluster = require('cluster')
mongodb = require('mongodb')
# mongobd_server = new mongodb.Server("10.60.38.69", 27017, {})



module.exports = class MailorServ

  constructor: (@host, @port) ->
    @app = require('express').createServer();
    @set_routes()
    cluster(@app).listen(@port, @host)
    # @app.listen(@port, @host)
    process.on "uncaughtException", (exception) ->
      console.error "uncaught exception: #{exception}!"

  set_routes: () ->
    @app.get "/", @hello_world
    @app.post "/:app", @mail

  mail: (req, res) ->
    console.log req.params
    console.log req.headers.bundlie
    
    # get data from req
    req.appname

    # send res
    res.send "success"

    # get smtp cred from mongo
    # send email to smtp

  hello_world: (req, res) ->
    res.send "hello BIG world"
