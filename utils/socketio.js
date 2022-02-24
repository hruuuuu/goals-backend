/* socket.io */
const dayjs = require('dayjs');

let clientList = [];
let onlinePeople = 0;
let chatId = '';

const initSocket = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  });
  io.on('connection', (socket) => {
    socket.on('clientMsg', (message) => {
      // broadcast用來通知客服
      socket.broadcast.emit('receivedClientMsg', message);
      io.sockets.emit(message.chatId, message); // 讓客戶也能收到自己傳出的訊息
      chatId = message.chatId;
    });
    socket.on('connectChat', (message) => {
      onlinePeople++;
      const time = dayjs().format('YYYY/MM/DD HH:mm:ss');
      const data = {
        chatId: message,
        onlineNo: onlinePeople, // 第幾人
        time: time,
        read: false,
      };
      // clientList.push(data);
      // console.log(`${data.chatId} ${time} 已連線`);
      socket.broadcast.emit('connectedClient', data);
    });
    socket.on('disconnectChat', (message) => {
      const time = dayjs().format('YYYY/MM/DD HH:mm:ss');
      const data = {
        chatId: message,
        onlineNo: onlinePeople,
        time: time,
      };
      // clientList = clientList.filter((item) => item.chatId !== message);
      // console.log(`${data.chatId} ${time} 已離線`);
      socket.broadcast.emit('disconnectedClient', data);
    });
    socket.on('adminMsg', (message) => {
      // console.log(`To ${message.to} 訊息: ${message.content} 已傳送`);
      socket.broadcast.emit(message.to, message);
      socket.emit('receivedAdminMsg', message);
    });
  });
};

module.exports = { initSocket };
