/* socket.io */
const conntection = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  });

  const roomName = 'memberId';

  io.on('connection', (socket) => {
    // 回傳給所有連結著的client
    socket.on(roomName, (message) => {
      io.sockets.emit(roomName, message);
    });

    // 回傳給除了發送者外所有連結著的client
    socket.on('broadcast', (message) => {
      socket.broadcast.emit('broadcast', message);
    });
    socket.on(`join chat ${roomName}`, (data) => {
      console.log(`${data.identity} connected to chat ${roomName}`);
    });
  });
};

module.exports = { conntection };
