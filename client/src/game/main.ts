import DrawHelper from "../helpers/DrawHelper.js";
import DrawableGameObject from "../interfaces/DrawableGameObject.js";
import DrawableGroup from "../interfaces/DrawableGroup.js";
import DrawableSprite from "../models/DrawableSprite.js";
import SpriteSheet from "../models/SpriteSheet.js";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let totalTime: number;
let lastTimestamp: number;
let deltaTime: number;

const children: DrawableGameObject[] = [];

initialize();

function initialize() {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const _context: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (_context === null) return;

  context = _context;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  DrawHelper.resizeCanvasToDisplaySize(canvas);

  const informationGroup = new DrawableGroup(
    0,
    0,
    canvas.width,
    100,
    "white",
    "informationGroup"
  );

  const gameGroup = new DrawableGroup(
    0,
    100,
    canvas.width,
    canvas.height,
    "gray",
    "gameGroup"
  );

  const playerSpriteSheet = new SpriteSheet("spritesheets/player2.png", 2, 4);

  const player = new DrawableSprite(
    playerSpriteSheet,
    1,
    3,
    0,
    0,
    50,
    50,
    true,
    "player"
  );

  gameGroup.addChild(player);

  children.push(informationGroup);
  children.push(gameGroup);

  // window.addEventListener("keydown", keydown, false);
  // window.addEventListener("keyup", keyup, false);
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp: number) {
  deltaTime = timestamp - lastTimestamp;
  totalTime = totalTime + deltaTime;
  lastTimestamp = totalTime;

  update(deltaTime, totalTime);
  draw(context);

  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function update(deltaTime: number, totalTime: number) {
  for (const child of children) {
    child.update(deltaTime, totalTime);
  }
}

function draw(context: CanvasRenderingContext2D) {
  DrawHelper.resizeCanvasToDisplaySize(canvas);
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const child of children) {
    if (child instanceof DrawableGameObject) child.draw(context);
  }
}

// INPUT FUNCTIONS
// function keydown(event) {
//   let key = keyMap[event.keyCode];
//   state.pressedKeys[key] = true;
// }

// function keyup(event) {
//   let key = keyMap[event.keyCode];
//   state.pressedKeys[key] = false;
// }
