import Picture from "./Picture.js";

export default class SpriteSheet extends Picture {
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
    super(
      url,
      () => {
        // Define the size of a frame
        this.frameWidth = Math.floor(this.img.width / this.columnCount);
        this.frameHeight = Math.floor(this.img.height / this.rowCount);
        if (onloadCallback) onloadCallback.call(this);
      },
      onerrorCallback
    );

    this.columnCount = columnCount;
    this.rowCount = rowCount;
  }

  public async draw(
    context: CanvasRenderingContext2D,
    column: number,
    row: number,
    x: number,
    y: number,
    width: number = 0,
    height: number = 0,
    deg: number = 0,
    flip: boolean = false,
    flop: boolean = false,
    center: boolean = false
  ): Promise<void> {
    super.drawSprite(
      context,
      column * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      width === 0 ? this.frameWidth : width,
      height === 0 ? this.frameHeight : height,
      deg,
      flip,
      flop,
      center
    );
  }
}
