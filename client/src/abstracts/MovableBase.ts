import Movable from "../interfaces/Movable.js";
import Point from "../models/base/Point.js";
import Rectangle from "../models/base/Rectangle.js";

export default abstract class MovableBase implements Movable {
  protected _x: number;
  protected _y: number;

  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._x = value;
    if (this.rectangle) this.rectangle.x = value;
  }

  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._y = value;
    if (this.rectangle) this.rectangle.y = value;
  }

  public width: number;
  public height: number;

  public rectangle: Rectangle;

  public speed: number;
  public directionX: number;
  public directionY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number
  ) {
    this.setXYWH(x, y, width, height);
    this.setSpeed(speed);
  }

  public async setXY(x: number, y: number): Promise<void> {
    const point = new Point(x, y);
    this.setPosition(point);
  }

  public async setPosition(position: Point): Promise<void> {
    this.directionX = this.x === position.x ? 0 : this.x > position.x ? -1 : 1;
    this.directionY = this.y === position.y ? 0 : this.y > position.y ? -1 : 1;

    this.x = position.x;
    this.y = position.y;
  }

  public async setXYWH(
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    const rectangle = new Rectangle(x, y, width, height);
    await this.setRectangle(rectangle);
  }

  public async setRectangle(rectangle: Rectangle): Promise<void> {
    this.rectangle = rectangle;

    this.setXY(rectangle.x, rectangle.y);
    this.width = rectangle.width;
    this.height = rectangle.height;
  }

  public async setSpeed(speed: number): Promise<void> {
    this.speed = speed;
  }

  public async getFutureRectangle(
    deltaTime: number,
    directionX: number,
    directionY: number
  ): Promise<Rectangle> {
    const futurePosition = await this.getFuturePosition(
      deltaTime,
      directionX,
      directionY
    );

    return new Rectangle(
      futurePosition.x,
      futurePosition.y,
      this.width,
      this.height
    );
  }

  public async getFuturePosition(
    deltaTime: number,
    directionX: number,
    directionY: number
  ): Promise<Point> {
    const speedX = directionX * this.speed;
    const speedY = directionY * this.speed;
    const futureX = Math.round(this.x + (speedX * deltaTime) / 1000);
    const futureY = Math.round(this.y + (speedY * deltaTime) / 1000);

    return new Point(futureX, futureY);
  }

  public async move(
    deltaTime: number,
    directionX: number,
    directionY: number
  ): Promise<void> {
    const speedX = directionX * this.speed;
    const speedY = directionY * this.speed;

    this.directionX = speedX === 0 ? 0 : speedX / Math.abs(speedX);
    this.directionY = speedY === 0 ? 0 : speedY / Math.abs(speedY);

    this.x = Math.round(this.x + (speedX * deltaTime) / 1000);
    this.y = Math.round(this.y + (speedY * deltaTime) / 1000);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(deltaTime: number, totalTime: number): Promise<void> {
    this.directionX = 0;
    this.directionY = 0;
  }
}
