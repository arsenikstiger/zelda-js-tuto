export default class SpriteSheet {
  public img: HTMLImageElement;
  public columnCount: number;
  public rowCount: number;
  public frameWidth: number;
  public frameHeight: number;

  constructor(
    url: string,
    columnCount: number,
    rowCount: number,
    onloadCallback?: (this: SpriteSheet) => void,
    onerrorCallback?: (this: SpriteSheet) => void
  ) {
    this.columnCount = columnCount;
    this.rowCount = rowCount;

    this.img = new Image();
    this.img.onload = () => {
      // Define the size of a frame
      this.frameWidth = Math.floor(this.img.width / this.columnCount);
      this.frameHeight = Math.floor(this.img.height / this.rowCount);

      if (onloadCallback) onloadCallback.call(this);
    };
    this.img.onerror = () => {
      if (onerrorCallback) onerrorCallback.call(this);
    };
    this.img.src = url;
  }

  public drawSprite(
    context: CanvasRenderingContext2D,
    column: number,
    row: number,
    x: number,
    y: number,
    width: number = 0,
    height: number = 0
  ): void {
    context.drawImage(
      this.img,
      column * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      width === 0 ? this.frameWidth : width,
      height === 0 ? this.frameHeight : height
    );
  }
}
