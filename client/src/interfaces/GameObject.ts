import Rectangle from "../models/base/Rectangle";

export default interface GameObject {
  tag: string;
  rectangle: Rectangle;

  initialize: (context: CanvasRenderingContext2D) => void;
  update: (deltaTime: number, totalTime: number) => void;
  draw: (context: CanvasRenderingContext2D) => void;
}
