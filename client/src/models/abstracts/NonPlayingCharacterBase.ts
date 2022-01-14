import CharacterBase from "./CharacterBase.js";
import Point from "../Point.js";

export default abstract class NonPlayingCharacterBase extends CharacterBase {
  public path: Point[];
  public currentPathPoint: number;

  public constructor(
    name: string,
    lives: number,

    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,

    spriteSheetImage: string,
    spriteSheetColumnCount: number,
    spriteSheetRowCount: number,

    upAnimation: Point[],
    downAnimation: Point[],
    leftAnimation: Point[],
    rightAnimation: Point[]
  ) {
    super(
      name,
      lives,
      x,
      y,
      width,
      height,
      speed,
      spriteSheetImage,
      spriteSheetColumnCount,
      spriteSheetRowCount,
      upAnimation,
      downAnimation,
      leftAnimation,
      rightAnimation
    );
  }

  public async setPath(path: Point[]): Promise<void> {
    this.currentPathPoint = 1;
    this.path = [];
    for (const p of path) {
      this.path.push(new Point(p.x + this.x, p.y + this.y));
    }
  }

  public async move(deltaTime: number, totalTime: number): Promise<void> {
    const directionX = this.path[this.currentPathPoint].x;
    const directionY = this.path[this.currentPathPoint].y;

    const distanceX = directionX - this.x;
    const distanceY = directionY - this.y;

    this.directionX = distanceX === 0 ? 0 : distanceX / Math.abs(distanceX);
    this.directionY = distanceY === 0 ? 0 : distanceY / Math.abs(distanceY);

    const speedX = this.directionX * this.speed;
    const speedY = this.directionY * this.speed;

    this.x = Math.round(this.x + (speedX * deltaTime) / 1000);
    this.y = Math.round(this.y + (speedY * deltaTime) / 1000);

    if (this.x === directionX && this.y === directionY)
      this.currentPathPoint =
        (this.currentPathPoint + 1) % (this.path.length);
  }
}
