const socketIo = require("socket.io");

let io = null;

module.exports = {
  connect: function (server) {
    io = socketIo(server);
    io.on("connection", (socket) => {
      console.log("connected");
    });
  },
  emit: function (event, values) {
    if (io) {
      io.sockets.emit(event, values);
    }
  },
};
