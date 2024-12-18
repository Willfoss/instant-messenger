const app = require("./app");

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const socketIo = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONT_END,
  },
});

socketIo.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (chat) => {
    socket.join(chat);
    console.log(`user joined chat: ${chat}`);
  });

  socket.on("typing", (chat) => socket.in(chat).emit("typing", chat));
  socket.on("stop typing", (chat) => socket.in(chat).emit("stop typing", chat));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat-users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData.Id);
  });
});
