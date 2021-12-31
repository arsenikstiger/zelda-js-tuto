import Rectangle from "../models/base/Rectangle.js";

export default class CollisionHelper {
  public static isPointInRectangle(x: number, y: number, rectangle: Rectangle): boolean {
    return (
      x > rectangle.x &&
      x < rectangle.x + rectangle.width &&
      y > rectangle.y &&
      y < rectangle.y + rectangle.height
    );
  }

  public static isRectangleInRectangle(rectangle1: Rectangle, rectangle2: Rectangle): boolean {
    return !(
      rectangle1.x > rectangle2.x + rectangle2.width ||
      rectangle1.x + rectangle1.width < rectangle2.x ||
      rectangle1.y > rectangle2.y + rectangle2.height ||
      rectangle1.y + rectangle1.height < rectangle2.y
    );
  }
}
