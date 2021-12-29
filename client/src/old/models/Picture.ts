export default class Picture {
  public url: string;
  public img: HTMLImageElement;

  constructor(url: string) {
    this.img = new HTMLImageElement();
    this.img.src = url;
  }

  public draw(context: CanvasRenderingContext2D, x: number, y: number, width: number = 0, height: number = 0): void {
    context.drawImage(
      this.img,
      x,
      y,
      width === 0 ? this.img.width : width,
      height === 0 ? this.img.height : height
    );
  }
}
