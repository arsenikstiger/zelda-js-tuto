import Point from "../Point.js";
import Rectangle from "../Rectangle.js";

export default interface Movable {
  x: number;
  y: number;
  width: number;
  height: number;

  rectangle: Rectangle;

  speed: number;
  directionX: number;
  directionY: number;

  setXY: (x: number, y: number) => void;
  setPosition: (position: Point) => void;
  setXYWH: (x: number, y: number, width: number, height: number) => void;
  setRectangle: (rectangle: Rectangle) => void;
  setSpeed: (speed: number) => void;

  getFuturePosition: (
    deltaTime: number,
    directionX: number,
    directionY: number
  ) => Promise<Point>;
  getFutureRectangle: (
    deltaTime: number,
    directionX: number,
    directionY: number
  ) => Promise<Rectangle>;

  move: (deltaTime: number, directionX: number, directionY: number) => void;
  // eslint-disable-next-line semi
}
