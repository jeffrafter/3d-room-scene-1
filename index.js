require('dotenv').config()

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const zReadingToFeet = require("./lib/z-reading-to-feet");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/three.min.js", (req, res) => {
  res.sendFile(__dirname + "/vendor/three.min.js");
});

app.get("/dat.gui.min.js", (req, res) => {
  res.sendFile(__dirname + "/vendor/dat.gui.min.js");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('wii-pos', message => {
    console.log('got wii-pos')
    io.emit('pos', message)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

// let dist = 2;
// setInterval(() => {
//   dist += 1;
//   if (dist > 40) dist = 2;
//   io.emit("z", { z: dist });
// }, 10);
