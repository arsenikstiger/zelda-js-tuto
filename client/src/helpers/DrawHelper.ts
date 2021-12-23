export default class DrawHelper {
  public static resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize =
      canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }

  public static clearScreen(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    color: string
  ): void {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  public static drawCircle(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    strokeColor: string,
    strokeWidth: number,
    fillColor: string,
    mustStroke: boolean = true,
    mustFill: boolean = true
  ): void {
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.fillStyle = fillColor;
    context.beginPath();
    context.arc(x, y, r, 0, (Math.PI / 180) * 360);
    if (mustStroke) context.stroke();
    if (mustFill) context.fill();
    context.closePath();
  }

  public static drawLine(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeColor: string,
    strokeWidth: number,
    fillColor: string,
    mustStroke: boolean = true,
    mustFill: boolean = true
  ): void {
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.fillStyle = fillColor;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    if (mustStroke) context.stroke();
    if (mustFill) context.fill();
    context.closePath();
  }

  public static drawRectangle(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeColor: string,
    strokeWidth: number,
    fillColor: string,
    mustStroke: boolean = true,
    mustFill: boolean = true
  ): void {
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.fillStyle = fillColor;
    if (mustStroke) context.strokeRect(x1, y1, x2 - x1, y2 - y1);
    if (mustFill) context.fillRect(x1, y1, x2 - x1, y2 - y1);
  }
}
