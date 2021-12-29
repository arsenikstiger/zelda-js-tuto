interface GameObject {
  tag: string;

  initialize: () => void;
  update: (deltaTime: number, totalTime: number) => void;
  draw: (context: CanvasRenderingContext2D) => void;
}
