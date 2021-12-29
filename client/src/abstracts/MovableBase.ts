export default abstract class MovableBase implements Movable {
  public x: number;
  public y: number;

  public futureX: number;
  public futureY: number;

  public speed: number;
  public speedX: number;
  public speedY: number;

  constructor(x: number, y: number, speed: number) {
    this.setPosition(x, y);
    this.setSpeed(speed);
  }

  public setPosition(x: number, y: number): void {
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
    this.futureY = this.y + this.speedY * deltaTime / 1000;
  }

  public moveDown(deltaTime: number): void {
    this.speedY = this.speed;
    this.futureY = this.y + this.speedY * deltaTime / 1000;
  }

  public moveLeft(deltaTime: number): void {
    this.speedX = -this.speed;
    this.futureX = this.x + this.speedX * deltaTime / 1000;
  }

  public moveRight(deltaTime: number): void {
    this.speedX = this.speed;
    this.futureX = this.x + this.speedX * deltaTime / 1000;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(deltaTime: number, totalTime: number): void {
    this.x = this.futureX;
    this.y = this.futureY;

    this.speedX = 0;
    this.speedY = 0;
  }
}
