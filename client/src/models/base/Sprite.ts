import SpriteSheet from "./SpriteSheet.js";

export default class Sprite {
  public spriteSheet: SpriteSheet;
  public column: number;
  public row: number;

  constructor(spriteSheet: SpriteSheet, column: number, row: number) {
    this.spriteSheet = spriteSheet;
    this.column = column;
    this.row = row;
  }

  public async draw(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number = 0,
    height: number = 0
  ): Promise<void> {
    this.spriteSheet.drawSprite(
      context,
      this.column,
      this.row,
      x,
      y,
      width === 0 ? this.spriteSheet.frameWidth : width,
      height === 0 ? this.spriteSheet.frameHeight : height
    );
  }
}
