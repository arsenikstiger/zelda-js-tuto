import GameObject from "./GameObject.js";

export default class DrawableGameObject extends GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public hasCollider: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    hasCollider: boolean = false,
    tag: string = ""
  ) {
    super(tag);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hasCollider = hasCollider;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public draw(context: CanvasRenderingContext2D): void {}
}