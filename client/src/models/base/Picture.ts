export default class Picture {
  public url: string;
  public img: HTMLImageElement;

  constructor(
    url: string,
    onloadCallback?: (this: Picture) => void,
    onerrorCallback?: (this: Picture) => void
  ) {
    this.img = new HTMLImageElement();
    this.img.src = url;
    this.img.onload = () => {
      if (onloadCallback) onloadCallback.call(this);
    };
    this.img.onerror = () => {
      if (onerrorCallback) onerrorCallback.call(this);
    };
  }

  public async draw(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number = 0,
    height: number = 0
  ): Promise<void> {
    context.drawImage(
      this.img,
      x,
      y,
      width === 0 ? this.img.width : width,
      height === 0 ? this.img.height : height
    );
  }
}
