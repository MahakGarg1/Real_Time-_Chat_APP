const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { newUser, formatMessage, getIndividualRoomUsers, getActiveUser, exitRoom } = require('./helper/helpers');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('Public'));
// this block will run when the client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = newUser(socket.id, username, room);
      socket.join(room);
    
      // welcome
    socket.emit('message', formatMessage("Airtribe", 'Messages are limited to this room! '));
  
     // Broadcast everytime users connects
     socket.broadcast.to(user.room).emit('message',formatMessage("Airtribe", `${username} has joined the room`));

   // Current active users and room name
   io.to(user.room).emit('roomUsers', {
     room: user.room,
     users: getIndividualRoomUsers(user.room)
   });
});
  // Listen for client message
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);
     io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

   // Runs when client disconnects
  
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);
      io.to(user.room).emit('message',formatMessage("Airtribe", `${user.username} has left the room`));
      
  // Current active users and room name
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getIndividualRoomUsers(user.room)
  });
  });
});
const PORT = 2011;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));