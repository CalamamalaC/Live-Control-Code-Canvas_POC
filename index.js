const WebSocket = require('ws');
const server_ws = new WebSocket.Server({
    port: 8080
  });

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {  
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/control', (req, res) => {
  res.sendFile(__dirname + '/src/control.html');
});

app.get('/code', (req, res) => {
  res.sendFile(__dirname + '/src/code.html');
});

app.get('/canvas', (req, res) => {
  res.sendFile(__dirname + '/src/canvas.html');
});

app.get('*.js', (req, res) => {
  res.sendFile(__dirname + req.url);
});
app.get('*.svg', (req, res) => {
  res.sendFile(__dirname + req.url);
});

app.get('*.css', (req, res) => {
  //res.writeHead(200, {"Content-Type": "text/css"});
  res.sendFile(__dirname + req.url);
});

app.get('*.frag', (req, res) => {
  res.sendFile(__dirname + req.url);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

let sockets_code;
let sockets_canvas = [];
let sockets_control = [];

let secretCode;

server_ws.on('connection', function(socket, req) {
  console.log("--> New " + req.url);

  if (req.url == "/canvas")
  {
    sockets_canvas.push(socket);
    socket.on('close', function() {    
      sockets_canvas = sockets_canvas.filter(s => s !== socket);
    });
  }
  else if (req.url == "/control")
  {
    sockets_control.push(socket);

    socket.on('message', function(data) {
      sockets_canvas.forEach(s => s.send(String(data)));
      if (sockets_code != null)
        sockets_code.send(String(data));
    });
  
    socket.on('close', function() {
      sockets_control = sockets_control.filter(s => s !== socket);
    });
  }
  else if (req.url == "/code")
  {
    //if code already exist
    if (sockets_code != null)
    {
      socket.close();
      return;
    }
    sockets_code = socket;

    socket.on('message', function message(data) {
      sockets_canvas.forEach(s => s.send(String(data)));
      sockets_control.forEach(s => s.send(String(data)));
    });
  
    socket.on('close', function() {
      sockets_code = null;
    });
  }
});