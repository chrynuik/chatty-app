const express = require('express');
const ws = require('ws');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

//const clients = [];

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
//

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function (client) {
    if (client.readyState === ws.OPEN) {
      client.send(data);
      //console.log("Message received:", data);
    }
  });
};

wss.on('connection', (socket) => {
  console.log('Client connected');
  //clients.push(socket);
  socket.on('message', function incoming(message) {
    var serverMessage = JSON.parse(message);
    serverMessage.key = uuidv1();
    console.log(serverMessage);
    if (serverMessage.type === "postMessage") {
      serverMessage.type = "incomingMessage";

    }
    if (serverMessage.type === "postNotification") {
      serverMessage.type = "incomingNotification";
      message.content = serverMessage.content;
    }



    //string message //parse
    //new object then broadcast object
    //console.log(typeof message);
    console.log('received: %s', message);

    wss.broadcast(JSON.stringify(serverMessage));
    console.log("outgoing message", serverMessage)
  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socket.on('close', () => console.log('Client disconnected'));
});