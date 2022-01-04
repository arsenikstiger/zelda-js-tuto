import Rectangle from "../Rectangle.js";

export default interface GameObject {
  tag: string;
  rectangle: Rectangle;

  initialize: (context: CanvasRenderingContext2D) => void;
  beforeupdate: () => void;
  update: (deltaTime: number, totalTime: number) => void;
  draw: (context: CanvasRenderingContext2D) => void;
  // eslint-disable-next-line semi
}
