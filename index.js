require('dotenv').config()

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const zReadingToFeet = require("./lib/z-reading-to-feet");

const script = process.env.WIIUSE_EXEC_PATH;

if (!script) {
  console.log('SORRY!')
  console.log('you must have WIIUSE_EXEC_PATH set in your .env file')
  console.log('-------------------^^^^^^^^^------------------------')

  process.exit(1)
}

// Step 1 disconnect the wii remote
// Step 2 hit up to turn on IR sensor
// Step 3 sense it
const spawn = require("child_process", [], { detached: true }).spawn;
const child = spawn(script);

child.stderr.on("data", function(data) {
  const matches = data.toString().match(/IR pos: \{(\d+), (\d+), (\d+\.?\d*)\}/);
  console.log(data.toString());
  if (matches) {
    const x = parseInt(matches[1]);
    const y = parseInt(matches[2]);
    const z = Math.round(parseFloat(matches[3], 0));
    if (z > 0) {
      io.emit("pos", { x, y, z });
    }
  }
});

child.unref();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/three.min.js", function(req, res) {
  res.sendFile(__dirname + "/three.min.js");
});

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});

// let dist = 2;
// setInterval(function() {
//   dist += 1;
//   if (dist > 40) dist = 2;
//   io.emit("z", { z: dist });
// }, 10);
