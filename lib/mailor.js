(function() {
  var MailorServ, argv, daemon, host, logfile, pidfile, port, usage, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
  MailorServ = require('./mailorServer');
  argv = require('optimist').argv;
  daemon = require('daemon');
  port = (_ref = (_ref2 = argv.p) != null ? _ref2 : argv.port) != null ? _ref : 8080;
  host = (_ref3 = (_ref4 = argv.h) != null ? _ref4 : argv.host) != null ? _ref3 : '0.0.0.0';
  process.title = 'mailor';
  if (argv.help) {
    usage = '\nUsage: analyze --host [host] --port [port]\n\nOptions:\n  -h | --host [optional]\n  -p | --port [optional]\n\n  -d          (daemonize)\n  --pid <file>\n  --log <file>\n';
    console.log(usage);
  } else {
    if (argv.d) {
      logfile = (_ref5 = argv.log) != null ? _ref5 : '/dev/null';
      pidfile = (_ref6 = argv.pid) != null ? _ref6 : '/var/run/mailor.pid';
      daemon.daemonize(logfile, pidfile, function(err, pid) {
        if (err) {
          return console.log("Error starting daemon: " + err);
        } else {
          console.log("Daemon started successfully with pid: " + pid);
          return new MailorServ(host, port);
        }
      });
    } else {
      new MailorServ(host, port);
    }
  }
}).call(this);
