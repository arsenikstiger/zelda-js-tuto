interface GameObject {
  tag: string;

  initialize: (context: CanvasRenderingContext2D) => void;
  update: (deltaTime: number, totalTime: number) => void;
  draw: (context: CanvasRenderingContext2D) => void;
}
