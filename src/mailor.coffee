MailorServ = require './mailorServer'
{argv} = require 'optimist'
daemon = require 'daemon'

port = argv.p ? argv.port ? 8080
host = argv.h ? argv.host ? '0.0.0.0'

process.title = 'mailor'

if argv.help
  usage = '''

  Usage: analyze --host [host] --port [port]

  Options:
    -h | --host [optional]
    -p | --port [optional]

    -d          (daemonize)
    --pid <file>
    --log <file>

  '''
  console.log usage
else
  if argv.d

    logfile = argv.log ? '/dev/null'
    pidfile = argv.pid ? '/var/run/mailor.pid'

    daemon.daemonize logfile, pidfile, (err, pid) ->
      if err
        console.log "Error starting daemon: #{err}"
      else
        console.log "Daemon started successfully with pid: #{pid}"
        new MailorServ(host, port)
  else
    new MailorServ(host, port)
