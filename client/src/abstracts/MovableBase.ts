import Movable from "../interfaces/Movable";

export default abstract class MovableBase implements Movable {
  public x: number;
  public y: number;

  protected _futureX: number;
  public get futureX(): number {
    return this._futureX;
  }
  public set futureX(value: number) {
    this._futureX = value;
  }
  protected _futureY: number;
  public get futureY(): number {
    return this._futureY;
  }
  public set futureY(value: number) {
    this._futureY = value;
  }

  public speed: number;
  public speedX: number;
  public speedY: number;

  constructor(x: number, y: number, speed: number) {
    this.setPosition(x, y);
    this.setSpeed(speed);
  }

  public async setPosition(x: number, y: number): Promise<void> {
    this.x = x;
    this.y = y;
    this.futureX = x;
    this.futureY = y;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public moveUp(deltaTime: number): void {
    this.speedY = -this.speed;
    this.futureY = Math.round(this.y + (this.speedY * deltaTime) / 1000);
  }

  public moveDown(deltaTime: number): void {
    this.speedY = this.speed;
    this.futureY = Math.round(this.y + (this.speedY * deltaTime) / 1000);
  }

  public moveLeft(deltaTime: number): void {
    this.speedX = -this.speed;
    this.futureX = Math.round(this.x + (this.speedX * deltaTime) / 1000);
  }

  public moveRight(deltaTime: number): void {
    this.speedX = this.speed;
    this.futureX = Math.round(this.x + (this.speedX * deltaTime) / 1000);
  }

  public cancelMove(deltaTime: number): void {
    this.futureX = this.x;
    this.futureY = this.y;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(deltaTime: number, totalTime: number): Promise<void> {
    this.x = this.futureX;
    this.y = this.futureY;

    this.speedX = 0;
    this.speedY = 0;
  }
}
