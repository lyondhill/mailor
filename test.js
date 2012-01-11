var http = require('http');
http.createServer(function (req, res) {
  // console.log(req);
  var body = '';
  req.on('data',function (chunk) {
  	console.log(chunk);
    body += chunk;
    console.log(body);
  });
  console.log(body);
  // console.log(req.headers);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('success');
}).listen(8080, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8080/');