import DrawableGameObject from "../interfaces/DrawableGameObject.js";
import Sprite from "./Sprite.js";
import SpriteSheet from "./SpriteSheet.js";

export default class DrawableSprite extends DrawableGameObject {
  public sprite: Sprite;

  constructor(
    spritesheet: SpriteSheet,
    spriteColumn: number,
    spriteRow: number,
    x: number,
    y: number,
    width: number,
    height: number,
    hasCollider: boolean = false,
    tag: string = ""
  ) {
    super(x, y, width, height, hasCollider, tag);

    this.sprite = new Sprite(spritesheet, spriteColumn, spriteRow);
  }

  public draw(context: CanvasRenderingContext2D): void {
    this.sprite.draw(context, this.x, this.y, this.width, this.height);
  }
}
