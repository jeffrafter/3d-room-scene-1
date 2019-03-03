var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const zReadingToFeet = require("./lib/z-reading-to-feet");

const script = "/Users/njero/Code/3droom/wiiuse/build/example/wiiuseexample";

// Step 1 disconnect the wii remote
// Step 2 hit up to turn on IR sensor
// Step 3 sense it
var spawn = require("child_process", [], { detached: true }).spawn;
var child = spawn(script);
child.stderr.on("data", function(data) {
  const matches = data.toString().match(/IR z distance: (\d+\.?\d*)/);
  console.log(data.toString());
  if (matches) {
    const z = Math.round(parseFloat(matches[1], 0));
    if (z > 0) {
      io.emit("z", { z });
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
