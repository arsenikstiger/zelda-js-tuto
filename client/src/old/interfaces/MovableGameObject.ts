import DrawableGameObject from "./DrawableGameObject.js";

export default class MovableGameObject extends DrawableGameObject {
  public speed: number;
  public directionX: number;
  public directionY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    tag: string = ""
  ) {
    super(x, y, width, height, true, tag);

    this.speed = speed;
  }

  moveUp(deltaTime: number): void {
    this.y = this.y - this.speed * deltaTime;
  }

  moveDown(deltaTime: number): void {
    this.y = this.y + this.speed * deltaTime;
  }

  moveLeft(deltaTime: number): void {
    this.x = this.x - this.speed * deltaTime;
  }

  moveRight(deltaTime: number): void {
    this.x = this.x + this.speed * deltaTime;
  }
}
