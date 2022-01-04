export default class Picture {
  public url: string;
  public img: HTMLImageElement;

  constructor(
    url: string,
    onloadCallback?: (this: Picture) => void,
    onerrorCallback?: (this: Picture) => void
  ) {
    this.img = new Image();
    this.img.src = url;
    this.img.onload = () => {
      if (onloadCallback) onloadCallback.call(this);
    };
    this.img.onerror = () => {
      if (onerrorCallback) onerrorCallback.call(this);
    };
  }

  public async drawImage(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number = 0,
    height: number = 0,
    deg: number = 0,
    flip: boolean = false,
    flop: boolean = false,
    center: boolean = false
  ): Promise<void> {
    if (width === 0) width = this.img.width;
    if (height === 0) height = this.img.height;

    this.drawSprite(
      context,
      x,
      y,
      width,
      height,
      x,
      y,
      width,
      height,
      deg,
      flip,
      flop,
      center
    );
  }

  public async drawSprite(
    context: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    swidth: number,
    sheight: number,
    dx: number,
    dy: number,
    dwidth: number,
    dheight: number,
    deg: number = 0,
    flip: boolean = false,
    flop: boolean = false,
    center: boolean = false
  ): Promise<void> {
    context.save();

    let isSprite = true;

    // SI les paramètres de destination ne sont pas fournis, on considère qu'ils l'ont été au travers des paramètres de source
    if (
      typeof dx === "undefined" ||
      typeof dy === "undefined" ||
      typeof dwidth === "undefined" ||
      typeof dheight === "undefined"
    ) {
      isSprite = false;
      dx = sx;
      dy = sy;
      dwidth = swidth;
      dheight = sheight;
    }

    // Set rotation point to center of image, instead of top/left
    if (center) {
      dx -= dwidth / 2;
      dy -= dheight / 2;
    }

    // Set the origin to the center of the image
    context.translate(dx + dwidth / 2, dy + dheight / 2);

    // Rotate the canvas around the origin
    if (deg % 360 !== 0) {
      const rad = 2 * Math.PI - (deg * Math.PI) / 180;
      context.rotate(rad);
      context.scale(-1, 1);
    }

    // Flip/flop the canvas
    const flipScale = flip ? -1 : 1;
    const flopScale = flop ? -1 : 1;
    context.scale(flipScale, flopScale);

    // Draw the image
    if (isSprite)
      context.drawImage(
        this.img,
        sx,
        sy,
        swidth,
        sheight,
        -dwidth / 2,
        -dheight / 2,
        dwidth,
        dheight
      );
    else
      context.drawImage(this.img, -dwidth / 2, -dheight / 2, dwidth, dheight);

    context.restore();
  }
}
