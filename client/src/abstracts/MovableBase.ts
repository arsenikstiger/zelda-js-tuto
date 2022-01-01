import Movable from "../interfaces/Movable.js";
import Point from "../models/base/Point.js";

export default abstract class MovableBase implements Movable {
  protected _x: number;
  public get x(): number {
    return this.x;
  }
  public set x(value: number) {
    this.x = value;
  }
  protected _y: number;
  public get y(): number {
    return this.y;
  }
  public set y(value: number) {
    this.y = value;
  }

  public speed: number;
  public speedX: number;
  public speedY: number;

  constructor(x: number, y: number, speed: number) {
    this.setXY(x, y);
    this.setSpeed(speed);
  }

  public async setXY(x: number, y: number): Promise<void> {
    this.x = x;
    this.y = y;
  }

  public async setPosition(position: Point): Promise<void> {
    this.x = position.x;
    this.y = position.y;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public getFuturePosition(
    deltaTime: number,
    directionX: number,
    directionY: number
  ): Point {
    const speedX = directionX * this.speed;
    const speedY = directionY * this.speed;
    const futureX = Math.round(this.x + (speedX * deltaTime) / 1000);
    const futureY = Math.round(this.y + (speedY * deltaTime) / 1000);
    return new Point(futureX, futureY);
  }

  public move(
    deltaTime: number,
    directionX: number,
    directionY: number): void {
    this.speedX = directionX * this.speed;
    this.speedY = directionY * this.speed;
    this.x = Math.round(this.x + (this.speedX * deltaTime) / 1000);
    this.y = Math.round(this.y + (this.speedY * deltaTime) / 1000);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(deltaTime: number, totalTime: number): Promise<void> {
    this.speedX = 0;
    this.speedY = 0;
  }
}
