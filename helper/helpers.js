const users = [];
const moment = require('moment');

// Join user to chat
const newUser = (id, username, room) => {
    const user = { id, username, room };
     users.push(user);
     console.log(user);
    return user;
  };
//format chat message
  const formatMessage = (username, text) => {
    return {
      username,
      text,
      time: moment().format('h:mm a')
    };
  };

  // Get room users
const getIndividualRoomUsers = (room) => {
    return users.filter(user => user.room === room);
  }

// Get current user
function getActiveUser(id) {
    return users.find(user => user.id === id);
  }
  // User leaves chat
const exitRoom = (id) =>{
    const index = users.findIndex(user => user.id === id);
  
      return users.splice(index, 1)[0];
    ;}

  module.exports = { newUser, formatMessage, getIndividualRoomUsers, getActiveUser, exitRoom };
  