require('dotenv').config()

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const zReadingToFeet = require("./lib/z-reading-to-feet");
const { Averager } = require('./lib/averager')

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/three.min.js", (req, res) => {
  res.sendFile(__dirname + "/vendor/three.min.js");
});

app.get("/dat.gui.min.js", (req, res) => {
  res.sendFile(__dirname + "/vendor/dat.gui.min.js");
});

const averager = new Averager()

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('wii-pos', position => {
    // console.log(position)
    const average = averager.averageWithPoint(position)
    // console.log(average)

    if (average) {
      io.emit('pos', average)
    }
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
