const express = require('express');
const { Server } = require('ws');
const http = require('http');

const app = express();
const port = 3000;

app.use(express.static('public'));

const server = http.createServer(app);
const wss = new Server({ server });

// Array to hold connected users
let connectedUsers = [];

wss.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for messages from the client
  socket.on('message', (data) => {
    const parsedData = JSON.parse(data);

    // Register a user with their userId
    if (parsedData.type === 'register') {
      const userId = parsedData.userId;
      // Add user to the array
      connectedUsers.push({ userId, socket });
      console.log(`User ${userId} connected`);
    }

    // Handle sending messages to a specific user
    if (parsedData.type === 'message') {
      const { userId, message } = parsedData;
      // Find the target user in the array
      const targetUser = connectedUsers.find(user => user.userId === userId);
      if (targetUser && targetUser.socket.readyState === targetUser.socket.OPEN) {
        targetUser.socket.send(JSON.stringify({ type: 'message', message }));
      }
    }
  });

  // Handle client disconnection
  socket.on('close', () => {
    // Remove disconnected user from the array
    connectedUsers = connectedUsers.filter(user => user.socket !== socket);
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
