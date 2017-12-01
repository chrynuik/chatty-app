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


//Broacase function to use when broadcasting
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function (client) {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
};

//variable used to count online users
let serverSet = new Set();

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.on('connection', (socket) => {
  console.log('Client connected');
  let userId = uuidv1();
  serverSet.add(userId);
  let userNum = serverSet.size;
  let onlineUsers = {
    numUser : userNum,
    type: "NumberOnlineUsers"
  };
  wss.broadcast(JSON.stringify(onlineUsers));
  socket.on('message', function incoming(message) {
    let serverMessage = JSON.parse(message);
    serverMessage.key = uuidv1();

    if (serverMessage.type === "postMessage") {
      serverMessage.type = "incomingMessage";
    }
    if (serverMessage.type === "postNotification") {
      serverMessage.type = "incomingNotification";
      message.content = serverMessage.content;
    }

    console.log('received: %s', message);

    wss.broadcast(JSON.stringify(serverMessage));

    console.log("outgoing message", serverMessage);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socket.on('close', () => {
    serverSet.delete(userId);
    userNum = serverSet.size;
    onlineUsers = {
      numUser : userNum,
      type: "NumberOnlineUsers"
    };
    wss.broadcast(JSON.stringify(onlineUsers));
    console.log('Client disconnected', userNum);
  });
});