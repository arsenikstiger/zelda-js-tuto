"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

let informationHeight = 26;

let playerX = 0;
let playerY = 0;
let playerSize = 100;

let playerSpeed = 200;
let playerSpeedX = 0;
let playerSpeedY = 0;

let playerDirectionX = 0;
let playerDirectionY = -1;

let playerCostumeX = 0;
let playerCostumeY = 0;

let bulletX = 0;
let bulletY = 0;
let bulletSpeed = 400;
let bulletSpeedX = 0;
let bulletSpeedY = 0;

let screenX = 0;
let screenY = 0;

let hasTopWall = false;
let hasBottomWall = true;
let hasLeftWall = true;
let hasRightWall = true;

let wallStrokeColor = "transparent";
let wallFillColor = "brown";
let wallSize = 100;

let secondsPassed;
let currentTimestamp;
let lastTimestamp;
let fps;

let spriteOutside;
let spritePlayer;

let costumeDurationMilliseconds = 300;
let costumeStartedAt = 0;

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

initialize();

function initialize() {
  spriteOutside = initSpriteFromUrl(
    "assets/spritesheets/outside.png",
    9,
    7
  );
  spritePlayer = initSpriteFromUrl(
    "assets/spritesheets/player2.png",
    2,
    4
  );

  window.addEventListener("keydown", keydown, false);
  window.addEventListener("keyup", keyup, false);
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  currentTimestamp = timestamp;

  update();
  draw();

  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function update() {
  debugger;

  updateSecondsPassed();
  updatePlayerSpeed();
  updatePlayerDirection();
  updatePlayerCostume();
  updatePlayerPosition();
}

function updateSecondsPassed() {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (currentTimestamp - lastTimestamp) / 1000;
  // Move forward in time with a maximum amount
  //   secondsPassed = Math.min(secondsPassed, 0.1);
  lastTimestamp = currentTimestamp;
}

function updatePlayerSpeed() {
  if (state.pressedKeys.left && state.pressedKeys.right) {
    playerSpeedX = 0;
  } else if (state.pressedKeys.left) {
    playerSpeedX = -playerSpeed;
  } else if (state.pressedKeys.right) {
    playerSpeedX = playerSpeed;
  } else {
    playerSpeedX = 0;
  }

  if (state.pressedKeys.up && state.pressedKeys.down) {
    playerSpeedY = 0;
  } else if (state.pressedKeys.up) {
    playerSpeedY = -playerSpeed;
  } else if (state.pressedKeys.down) {
    playerSpeedY = playerSpeed;
  } else {
    playerSpeedY = 0;
  }
}

function updatePlayerDirection() {
  playerDirectionX =
    playerSpeedX === 0 ? 0 : playerSpeedX / Math.abs(playerSpeedX);
  playerDirectionY =
    playerSpeedY === 0 ? 0 : playerSpeedY / Math.abs(playerSpeedY);
}

function updatePlayerCostume() {
  if (currentTimestamp - costumeStartedAt > costumeDurationMilliseconds) {
    playerCostumeX = !playerCostumeX;
    costumeStartedAt = currentTimestamp;
  }

  if (playerDirectionY === -1) {
    playerCostumeY = 0;
  } else if (playerDirectionY === 1) {
    playerCostumeY = 3;
  } else if (playerDirectionX === -1) {
    playerCostumeY = 1;
  } else if (playerDirectionX === 1) {
    playerCostumeY = 2;
  } else {
    playerCostumeX = 1;
    playerCostumeY = 3;
  }
}

function updatePlayerPosition() {
  playerX = Number.isNaN(playerX) ? 0 : playerX + playerSpeedX * secondsPassed;
  playerY = Number.isNaN(playerY) ? 0 : playerY + playerSpeedY * secondsPassed;

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
  drawCharacter();
}

function drawWalls() {
  // console.log("drawWalls");
  // TOP
  if (hasTopWall) {
    for (let wallX = 0; wallX < Math.trunc(canvas.width / wallSize) + 1; wallX++) {
      drawSprite(
        spriteOutside,
        7,
        2,
        wallX * wallSize,
        informationHeight,
        wallSize,
        wallSize
      );
    }
  }
  // BOTTOM
  if (hasBottomWall) {
    for (
      let wallX = 0;
      wallX < Math.trunc(canvas.width / wallSize) + 1;
      wallX++
    ) {
      drawSprite(
        spriteOutside,
        7,
        2,
        wallX * wallSize,
        canvas.height - wallSize,
        wallSize,
        wallSize
      );
    }
  }
  // LEFT
  if (hasLeftWall) {
    for (
      let wallY = 0;
      wallY < Math.trunc((canvas.height - informationHeight) / wallSize) + 1;
      wallY++
    ) {
      drawSprite(
        spriteOutside,
        7,
        2,
        0,
        informationHeight + wallY * wallSize,
        wallSize,
        wallSize
      );
    }
  }
  // RIGHT
  if (hasRightWall) {
    for (
      let wallY = 0;
      wallY < Math.trunc((canvas.height - informationHeight) / wallSize) + 1;
      wallY++
    ) {
      drawSprite(
        spriteOutside,
        7,
        2,
        canvas.width - wallSize,
        informationHeight + wallY * wallSize,
        wallSize,
        wallSize
      );
    }
  }
}

function drawCharacter() {
  // console.log("drawCharacter");
  drawSprite(
    spritePlayer,
    playerCostumeX,
    playerCostumeY,
    playerX,
    informationHeight + playerY,
    playerSize,
    playerSize
  );
}

function drawBullet() {}

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
  // console.log("clearScreen");
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
  // console.log("drawCircle");
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
  // console.log("drawLine");
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
  // console.log("drawRectangle");
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = fillColor;
  if (mustStroke) ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  if (mustFill) ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
}

function initImageFromUrl(url) {
  let img = {};
  img = new Image();
  img.src = url;

  return img;
}

function drawImage(img, x, y, width = 0, height = 0) {
  ctx.drawImage(
    img,
    x,
    y,
    width === 0 ? img.width : width,
    height === 0 ? img.height : height
  );
}

function initSpriteFromUrl(url, columnCount, rowCount) {
  let sprite = {};
  sprite.img = new Image();

  sprite.img.onload = function () {
    // Define the size of a frame
    sprite.frameWidth = sprite.img.width / columnCount;
    sprite.frameHeight = (sprite.img.height) / rowCount;
  };

  sprite.img.src = url;

  sprite.columnCount = columnCount;
  sprite.rowCount = rowCount;

  return sprite;
}

function drawSprite(sprite, column, row, x, y, width = 0, height = 0) {
  ctx.drawImage(
    sprite.img,
    column * sprite.frameWidth,
    row * sprite.frameHeight,
    sprite.frameWidth,
    sprite.frameHeight,
    x,
    y,
    width === 0 ? sprite.frameWidth : width,
    height === 0 ? sprite.frameHeight : height
  );
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
