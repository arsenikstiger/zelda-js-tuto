import Point from "./Point.js";

export default class Rectangle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public get nw(): Point {
    return new Point(this.x, this.y);
  }

  public get ne(): Point {
    return new Point(this.x + this.width, this.y);
  }

  public get sw(): Point {
    return new Point(this.x, this.y + this.height);
  }

  public get se(): Point {
    return new Point(this.x + this.width, this.y + this.height);
  }

  public constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}