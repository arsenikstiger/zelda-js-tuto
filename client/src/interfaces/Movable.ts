import Point from "../models/base/Point.js";

export default interface Movable {
  x: number;
  y: number;

  speed: number;
  speedX: number;
  speedY: number;

  setXY: (x: number, y: number) => void;
  setPosition: (position: Point) => void;
  setSpeed: (speed: number) => void;

  getFuturePosition: (deltaTime: number, directionX: number, directionY: number) => Point;
  move: (deltaTime: number, diredctionX: number, directionY: number) => void;
  // eslint-disable-next-line semi
}
