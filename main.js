"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

let informationHeight = 26;

// Player
let playerX = 0;
let playerY = 0;
let playerSize = 100;

let movingSpeed = 200;
let movingSpeedX = 0;
let movingSpeedY = 0;

let directionX = 1;
let directionY = 0;
           
// Bullet
let bulletX = 0;
let bulletY = 0;
let bulletSize = 20;
let bulletExists = false;
let bulletSpeed = 1000;
let bulletSpeedX = 0;
let bulletSpeedY = 0;

let movingBulletX = 0;
let movingBulletY = 0;

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
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
  },
};

let keyMap = {
  39: "right",
  37: "left",
  38: "up",
  40: "down",
  32: "space",
};

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

initialize();

function initialize() {
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  update(timestamp);
  draw();

  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function update(timestamp) {
  updateSecondsPassed(timestamp);

  updatePlayerSpeed();
  updatePlayerPosition();

  updateBulletSpeed();
  updateBulletPosition();
}

function updateSecondsPassed(timestamp) {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timestamp - oldtimestamp) / 1000;
  // Move forward in time with a maximum amount
  //   secondsPassed = Math.min(secondsPassed, 0.1);
  oldtimestamp = timestamp;
}

function updatePlayerSpeed() {
  if (state.pressedKeys.left && state.pressedKeys.right) {
    movingSpeedX = 0;
  } else if (state.pressedKeys.left) {
    movingSpeedX = -movingSpeed;
  } else if (state.pressedKeys.right) {
    movingSpeedX = movingSpeed;
  } else {
    movingSpeedX = 0;
  }

  if (state.pressedKeys.up && state.pressedKeys.down) {
    movingSpeedY = 0;
  } else if (state.pressedKeys.up) {
    movingSpeedY = -movingSpeed;
  } else if (state.pressedKeys.down) {
    movingSpeedY = movingSpeed;
  } else {
    movingSpeedY = 0;
  }

  if (movingSpeedX === 0 && movingSpeedY === 0) {

  } else if (movingSpeedX === 0) {
    directionX = 0;
    directionY = movingSpeedY / Math.abs(movingSpeedY);
  } else if (movingSpeedY === 0) {
    directionX = movingSpeedX === 0 ? directionX : movingSpeedX / Math.abs(movingSpeedX);
    directionY = 0;
  } else {
    directionX = movingSpeedX / Math.abs(movingSpeedX);
    directionY = movingSpeedY / Math.abs(movingSpeedY);

  }

}

function updatePlayerPosition() {
  playerX = Number.isNaN(playerX) ? 0 : playerX + movingSpeedX * secondsPassed;
  playerY = Number.isNaN(playerY) ? 0 : playerY + movingSpeedY * secondsPassed;

  if (playerX < 0 + (hasLeftWall ? wallSize : 0)) {
    playerX = hasLeftWall ? wallSize : 0;

    if (!hasLeftWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = false;

      playerX = canvas.width - playerSize - 2 - (hasRightWall ? wallSize : 0);
    }
  }

  if (playerX > canvas.width - playerSize - 1 - (hasRightWall ? wallSize : 0)) {
    playerX = canvas.width - playerSize - 2 - (hasRightWall ? wallSize : 0);

    if (!hasRightWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = false;
      hasRightWall = Math.random() < 0.5 ? false : true;

      playerX = hasLeftWall ? wallSize : 0;
    }
  }

  if (playerY < 0 + (hasTopWall ? wallSize : 0)) {
    playerY = hasTopWall ? wallSize : 0;

    if (!hasTopWall) {
      hasTopWall = Math.random() < 0.5 ? false : true;
      hasBottomWall = false;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = Math.random() < 0.5 ? false : true;

      playerY =
        canvas.height -
        playerSize -
        informationHeight -
        2 -
        (hasBottomWall ? wallSize : 0);
    }
  }

  if (
    playerY >
    canvas.height -
      playerSize -
      informationHeight -
      1 -
      (hasBottomWall ? wallSize : 0)
  ) {
    playerY =
      canvas.height -
      playerSize -
      informationHeight -
      2 -
      (hasBottomWall ? wallSize : 0);

    if (!hasBottomWall) {
      hasTopWall = false;
      hasBottomWall = Math.random() < 0.5 ? false : true;
      hasLeftWall = Math.random() < 0.5 ? false : true;
      hasRightWall = Math.random() < 0.5 ? false : true;

      playerY = 0;
    }
  }
}

function updateBulletSpeed() {
  if (state.pressedKeys.space && !bulletExists) {
    if (state.pressedKeys.left && state.pressedKeys.right) {
      bulletSpeedX = directionX * bulletSpeed;
    } else if (state.pressedKeys.left) {
      bulletSpeedX = -bulletSpeed;
    } else if (state.pressedKeys.right) {
      bulletSpeedX = bulletSpeed;
    } else {
      bulletSpeedX = directionX * bulletSpeed;
    }

    if (state.pressedKeys.up && state.pressedKeys.down) {
      bulletSpeedY = directionY * bulletSpeed;
    } else if (state.pressedKeys.up) {
      bulletSpeedY = -bulletSpeed;
    } else if (state.pressedKeys.down) {
      bulletSpeedY = bulletSpeed;
    } else {
      bulletSpeedY = directionY * bulletSpeed;
    }

    bulletExists = true;
    bulletX = playerX + (playerSize - bulletSize) / 2;
    bulletY = playerY + (playerSize - bulletSize) / 2;
  }
}

function updateBulletPosition() {
  bulletX = Number.isNaN(bulletX) ? 0 : bulletX + bulletSpeedX * secondsPassed;
  bulletY = Number.isNaN(bulletY) ? 0 : bulletY + bulletSpeedY * secondsPassed;

  if (bulletX < 0 + (hasLeftWall ? wallSize : 0)) {
    bulletExists = false;
  }

  if (bulletX > canvas.width - bulletSize - 1 - (hasRightWall ? wallSize : 0)) {
    bulletExists = false;
  }

  if (bulletY < 0 + (hasTopWall ? wallSize : 0)) {
    bulletExists = false;
  }

  if (
    bulletY >
    canvas.height -
      bulletSize -
      informationHeight -
      1 -
      (hasBottomWall ? wallSize : 0)
  ) {
    bulletExists = false;
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
  ctx.fillStyle = "white";
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
  ctx.fillText("Zelda", canvas.width - measure.width - 1, 22);
}

// DRAW GAME
function drawGame() {
  drawWalls();
  drawBullet();
  drawCharacter();
}

function drawWalls() {
  console.log("drawCharacter");
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

function drawBullet() {
  console.log("drawBullet");

  if (!bulletExists) return;

  drawCircle(
    bulletX + bulletSize / 2 + 1,
    informationHeight + bulletY + bulletSize / 2 + 1,
    bulletSize / 2,
    "black",
    2,
    "red"
  );
}

function drawCharacter() {
  console.log("drawCharacter");
  drawCircle(
    playerX + playerSize / 2 + 1,
    informationHeight + playerY + playerSize / 2 + 1,
    playerSize / 2,
    "black",
    2,
    "white"
  );

  drawCircle(
    playerX + playerSize / 2 + 1 + 20 * directionX,
    informationHeight + playerY + playerSize / 2 + 1 + 20 * directionY,
    5,
    "black",
    2,
    "black"
  );
  // ctx.fillStyle = "black";
  // ctx.fillText(
  //   "Z",
  //   playerX + playerSize / 2 + 1 - 12 / 2,
  //   informationHeight + playerY + playerSize / 2 + 1 + 12 / 2
  // );
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
