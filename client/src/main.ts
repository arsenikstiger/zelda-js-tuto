let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let totalTime: number;
let lastTimestamp: number;
let deltaTime: number;

initialize();

function initialize() {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const _context: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (_context === null) return;

  context = _context;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  // DrawHelper.resizeCanvasToDisplaySize(canvas);

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
  console.log(deltaTime);
}

function draw(context: CanvasRenderingContext2D) {
  // DrawHelper.resizeCanvasToDisplaySize(canvas);
  context.clearRect(0, 0, canvas.width, canvas.height);
}
