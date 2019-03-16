require('dotenv').config()

const io = require('socket.io-client')
const socket = io('http://localhost:3000')


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
      socket.emit('wii-pos', { x, y, z });
    }
  }
});

child.unref();
