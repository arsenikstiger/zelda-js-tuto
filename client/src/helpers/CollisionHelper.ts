import Point from "../models/Point.js";
import Rectangle from "../models/Rectangle.js";

export default class CollisionHelper {
  public static isPointInRectangle(point: Point, rectangle: Rectangle): boolean {
    return (
      point.x >= rectangle.x &&
      point.x <= rectangle.x + rectangle.width &&
      point.y >= rectangle.y &&
      point.y <= rectangle.y + rectangle.height
    );
  }

  public static isRectangleInRectangle(rectangle1: Rectangle, rectangle2: Rectangle): boolean {
    return !(
      rectangle1.x >= rectangle2.x + rectangle2.width ||
      rectangle1.x + rectangle1.width <= rectangle2.x ||
      rectangle1.y >= rectangle2.y + rectangle2.height ||
      rectangle1.y + rectangle1.height <= rectangle2.y
    );
  }
}
