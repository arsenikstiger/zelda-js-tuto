"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

let informationHeight = 26;

// Player 1
let player1X = 0;
let player1Y = 0;
let player1Size = 100;
let player1Speed = 800;
let player1SpeedX = 0;
let player1SpeedY = 0;

// Player 2
let player2X = 0;
let player2Y = 0;
let player2Size = 100;
let player2Speed = 800;
let player2SpeedX = 0;
let player2SpeedY = 0;

// Player 2
let Player2X = 0;
let Player2Y = 0;
let Player2Size = 100;
let Player2Speed = 800;
let Player2SpeedX = 0;
let Player2SpeedY = 0;

// Enemy
let EnemyX = 0;
let EnemyY = 0;
let EnemySize = 100;
let EnemySpeed = 100;
let EnemySpeedX = 0;
let EnemySpeedY = 0;

// Screen
let screenX = 0;
let screenY = 0;

let hasTopWall = false;
let hasBottomWall = true;
let hasLeftWall = true;
let hasRightWall = true;

let wallStrokeColor = "transparent";
let wallFillColor = "brown";
let wallSize = 20;

let secondsPassed;
let oldtimestamp;
let fps;

let state = {
  pressedKeys: {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,

    z: false,
    s: false,
    q: false,
    d: false,
    a: false,
  },
};

let keyMap = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  32: "space",

  90: "z",
  83: "s",
  81: "q",
  68: "d",
  65: "a",
};

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);
// The proper game loop
window.requestAnimationFrame(gameLoop);

function gameLoop(timestamp) {
  update(timestamp);
  draw();

  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function update(timestamp) {
  updateSecondsPassed(timestamp);

  updatePlayer1Speed();
  updatePlayer1Position();

  updatePlayer2Speed();
  updatePlayer2Position();

  updateEnemySpeed();
  updateEnemyPosition();
}

function updateSecondsPassed(timestamp) {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timestamp - oldtimestamp) / 1000;
  // Move forward in time with a maximum amount
  //   secondsPassed = Math.min(secondsPassed, 0.1);
  oldtimestamp = timestamp;
}

function updatePlayer1Speed() {
  if (state.pressedKeys.left && state.pressedKeys.right) {
    player1SpeedX = 0;
  } else if (state.pressedKeys.left) {
    player1SpeedX = -player1Speed;
  } else if (state.pressedKeys.right) {
    player1SpeedX = player1Speed;
  } else {
    player1SpeedX = 0;
  }

  if (state.pressedKeys.up && state.pressedKeys.down) {
    player1SpeedY = 0;
  } else if (state.pressedKeys.up) {
    player1SpeedY = -player1Speed;
  } else if (state.pressedKeys.down) {
    player1SpeedY = player1Speed;
  } else {
    player1SpeedY = 0;
  }

  if (state.pressedKeys.space) {
    player1SpeedX = player1SpeedX * 4;
    player1SpeedY = player1SpeedY * 4;
  }
}

function updatePlayer1Position() {
  player1X = Number.isNaN(player1X)
    ? 0
    : player1X + player1SpeedX * secondsPassed;
  player1Y = Number.isNaN(player1Y)
    ? 0
    : player1Y + player1SpeedY * secondsPassed;

  if (player1X < 0 + (hasLeftWall ? wallSize : 0)) {
    player1X = hasLeftWall ? wallSize : 0;

    if (!hasLeftWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = false;

      player1X = canvas.width - player1Size - 2 - (hasRightWall ? wallSize : 0);
    }
  }

  if (
    player1X >
    canvas.width - player1Size - 1 - (hasRightWall ? wallSize : 0)
  ) {
    player1X = canvas.width - player1Size - 2 - (hasRightWall ? wallSize : 0);

    if (!hasRightWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = false;
      hasRightWall = Math.random() < 0.5 ? false : true;

      player1X = hasLeftWall ? wallSize : 0;
    }
  }

  if (player1Y < 0 + (hasTopWall ? wallSize : 0)) {
    player1Y = hasTopWall ? wallSize : 0;

    if (!hasTopWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = false;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = Math.random() < 0.5 ? false : true;

      player1Y =
        canvas.height -
        player1Size -
        informationHeight -
        2 -
        (hasBottomWall ? wallSize : 0);
    }
  }

  if (
    player1Y >
    canvas.height -
      player1Size -
      informationHeight -
      1 -
      (hasBottomWall ? wallSize : 0)
  ) {
    player1Y =
      canvas.height -
      player1Size -
      informationHeight -
      2 -
      (hasBottomWall ? wallSize : 0);

    if (!hasBottomWall) {
      hasTopWall = false;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = Math.random() < 0.5 ? false : true;

      player1Y = 0;
    }
  }
}

function updatePlayer2Speed() {
  if (state.pressedKeys.q && state.pressedKeys.d) {
    player2SpeedX = 0;
  } else if (state.pressedKeys.q) {
    player2SpeedX = -player2Speed;
  } else if (state.pressedKeys.d) {
    player2SpeedX = player2Speed;
  } else {
    player2SpeedX = 0;
  }

  if (state.pressedKeys.z && state.pressedKeys.s) {
    player2SpeedY = 0;
  } else if (state.pressedKeys.z) {
    player2SpeedY = -player2Speed;
  } else if (state.pressedKeys.s) {
    player2SpeedY = player2Speed;
  } else {
    player2SpeedY = 0;
  }

  if (state.pressedKeys.a) {
    player2SpeedX = player2SpeedX * 4;
    player2SpeedY = player2SpeedY * 4;
  }
}

function updatePlayer2Position() {
  player2X = Number.isNaN(player2X)
    ? 0
    : player2X + player2SpeedX * secondsPassed;
  player2Y = Number.isNaN(player2Y)
    ? 0
    : player2Y + player2SpeedY * secondsPassed;

  if (player2X < 0 + (hasLeftWall ? wallSize : 0)) {
    player2X = hasLeftWall ? wallSize : 0;

    if (!hasLeftWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = false;

      player2X = canvas.width - player2Size - 2 - (hasRightWall ? wallSize : 0);
    }
  }

  if (
    player2X >
    canvas.width - player2Size - 1 - (hasRightWall ? wallSize : 0)
  ) {
    player2X = canvas.width - player2Size - 2 - (hasRightWall ? wallSize : 0);

    if (!hasRightWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = false;
      hasRightWall = Math.random() < 0.5 ? false : true;

      player2X = hasLeftWall ? wallSize : 0;
    }
  }

  if (player2Y < 0 + (hasTopWall ? wallSize : 0)) {
    player2Y = hasTopWall ? wallSize : 0;

    if (!hasTopWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = false;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = Math.random() < 0.5 ? false : true;

      player2Y =
        canvas.height -
        player2Size -
        informationHeight -
        2 -
        (hasBottomWall ? wallSize : 0);
    }
  }

  if (
    player2Y >
    canvas.height -
      player2Size -
      informationHeight -
      1 -
      (hasBottomWall ? wallSize : 0)
  ) {
    player2Y =
      canvas.height -
      player2Size -
      informationHeight -
      2 -
      (hasBottomWall ? wallSize : 0);

    if (!hasBottomWall) {
      hasTopWall = false;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = Math.random() < 0.5 ? false : true;

      player2Y = 0;
    }
  }
}

function updateEnemyPosition() {
  EnemyX = Number.isNaN(EnemyX) ? 0 : EnemyX + EnemySpeedX * secondsPassed;
  EnemyY = Number.isNaN(EnemyY) ? 0 : EnemyY + EnemySpeedY * secondsPassed;

  if (EnemyX < 0 + (hasLeftWall ? wallSize : 0)) {
    EnemyX = hasLeftWall ? wallSize : 0;
  }

  if (EnemyX > canvas.width - EnemySize - 1 - (hasRightWall ? wallSize : 0)) {
    EnemyX = canvas.width - EnemySize - 2 - (hasRightWall ? wallSize : 0);
  }

  if (EnemyY < 0 + (hasTopWall ? wallSize : 0)) {
    EnemyY = hasTopWall ? wallSize : 0;
  }

  if (
    EnemyY >
    canvas.height -
      EnemySize -
      informationHeight -
      1 -
      (hasBottomWall ? wallSize : 0)
  ) {
    EnemyY =
      canvas.height -
      EnemySize -
      informationHeight -
      2 -
      (hasBottomWall ? wallSize : 0);
  }
}

function updateEnemySpeed() {
  let directionX = Math.random() * 3;
  let directionY = Math.random() * 3;

  if (directionX < 1) {
    EnemySpeedX = -EnemySpeed;
  } else if (directionX < 2) {
    EnemySpeedX = EnemySpeed;
  } else {
    EnemySpeedX = 0;
  }

  if (directionY < 1) {
    EnemySpeedY = -EnemySpeed;
  } else if (directionY < 2) {
    EnemySpeedY = EnemySpeed;
  } else {
    EnemySpeedY = 0;
  }
}

// DRAW
function draw() {
  resizeCanvasToDisplaySize();
  clearScreen();
  drawInformation();
  drawGame();
}

// DRAW INFORMATION
function drawInformation() {
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, canvas.width, informationHeight);
  //   ctx.strokeStyle = "black";
  //   ctx.strokeRect(0, 0, canvas.width, informationHeight);

  ctx.font = "24px Arial";
  ctx.fillStyle = "black";

  drawInformation_FPS();
  drawInformation_Time();
  drawInformation_Name();
}

function drawInformation_FPS() {
  // Calculate fps
  fps = Math.round(1 / secondsPassed);

  // Draw number to the screen
  ctx.fillText("FPS: " + fps, 1, 22);
}

function drawInformation_Time() {
  let today = new Date();
  let time =
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":" +
    ("0" + today.getSeconds()).slice(-2);

  let measure = ctx.measureText(time);
  ctx.fillText(time, canvas.width / 2 - measure.width / 2, 22);
}

function drawInformation_Name() {
  let measure = ctx.measureText("Zelda");
  ctx.fillText("Zelda & Link", canvas.width - measure.width - 80, 22);
}

// DRAW GAME
function drawGame() {
  drawWalls();
  drawEnemy();
  drawPlayer1();
  drawPlayer2();
}

function drawWalls() {
  console.log("drawWalls");
  // TOP
  if (hasTopWall)
    drawRectangle(
      0,
      informationHeight,
      canvas.width,
      informationHeight + wallSize,
      wallStrokeColor,
      1,
      wallFillColor
    );
  // BOTTOM
  if (hasBottomWall)
    drawRectangle(
      0,
      canvas.height - wallSize,
      canvas.width,
      canvas.height,
      wallStrokeColor,
      1,
      wallFillColor
    );
  // LEFT
  if (hasLeftWall)
    drawRectangle(
      0,
      informationHeight,
      0 + wallSize,
      canvas.height,
      wallStrokeColor,
      1,
      wallFillColor
    );
  // RIGHT
  if (hasRightWall)
    drawRectangle(
      canvas.width - wallSize,
      informationHeight,
      canvas.width,
      canvas.height,
      wallStrokeColor,
      1,
      wallFillColor
    );
}

function drawEnemy() {
  console.log("drawEnemy");
  drawCircle(
    EnemyX + EnemySize / 2 + 1,
    informationHeight + EnemyY + EnemySize / 2 + 1,
    EnemySize / 2,
    "red",
    2,
    "red"
  );
  ctx.fillStyle = "black";
  ctx.fillText(
    "boko",
    EnemyX + EnemySize / 3 + 1 - 12 / 2,
    informationHeight + EnemyY + EnemySize / 2 + 1 + 12 / 2
  );
}

function drawPlayer1() {
  console.log("drawPlayer1");
  drawCircle(
    player1X + player1Size / 2 + 1,
    informationHeight + player1Y + player1Size / 2 + 1,
    player1Size / 2,
    "black",
    2,
    "white"
  );
  ctx.fillStyle = "black";
  ctx.fillText(
    "Zelda",
    player1X + player1Size / 4 + 1 - 12 / 2,
    informationHeight + player1Y + player1Size / 2 + 1 + 12 / 2
  );
}

function drawPlayer2() {
  console.log("drawPlayer2");
  drawCircle(
    player2X + player2Size / 2 + 1,
    informationHeight + player2Y + player2Size / 2 + 1,
    player2Size / 2,
    "white",
    // skyBlue
    2,
    "black"
    // blue
  );
  ctx.fillStyle = "white";
  // skyBlue
  ctx.fillText(
    "Link",
    player2X + player2Size / 3 + 1 - 12 / 2,
    informationHeight + player2Y + player2Size / 2 + 1 + 12 / 2
  );
}

// DRAW FUNCTIONS

function resizeCanvasToDisplaySize() {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function clearScreen() {
  console.log("clearScreen");
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(
  x,
  y,
  r,
  strokeColor,
  strokeWidth,
  fillColor,
  mustStroke = true,
  mustFill = true
) {
  console.log("drawCircle");
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, (Math.PI / 180) * 360);
  if (mustStroke) ctx.stroke();
  if (mustFill) ctx.fill();
  ctx.closePath();
}

function drawLine(
  x1,
  y1,
  x2,
  y2,
  strokeColor,
  strokeWidth,
  fillColor,
  mustStroke = true,
  mustFill = true
) {
  console.log("drawLine");
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  if (mustStroke) ctx.stroke();
  if (mustFill) ctx.fill();
  ctx.closePath();
}

function drawRectangle(
  x1,
  y1,
  x2,
  y2,
  strokeColor,
  strokeWidth,
  fillColor,
  mustStroke = true,
  mustFill = true
) {
  console.log("drawRectangle");
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = fillColor;
  if (mustStroke) ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  if (mustFill) ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
}

// INPUT FUNCTIONS
function keydown(event) {
  let key = keyMap[event.keyCode];
  state.pressedKeys[key] = true;
}

function keyup(event) {
  let key = keyMap[event.keyCode];
  state.pressedKeys[key] = false;
}
