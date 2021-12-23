import DrawableGameObject from "./DrawableGameObject.js";

export default class DrawableGroup extends DrawableGameObject {
  public backColor: string;
  public children: DrawableGameObject[];

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    backColor: string,
    tag: string = ""
  ) {
    super(x, y, width, height, false, tag);

    this.backColor = backColor;
    this.children = [];
  }

  public addChild(child: DrawableGameObject): void {
    this.children.push(child);
  }

  public update(deltaTime: number, totalTime: number): void {
    for (const child of this.children) {
      child.update(deltaTime, totalTime);
    }
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.save();

    const region = new Path2D();
    region.rect(this.x, this.y, this.width, this.height);
    context.clip(region);

    context.translate(this.x, this.y);

    context.fillStyle = this.backColor;
    context.fillRect(0, 0, this.width, this.height);

    for (const child of this.children) {
      child.draw(context);
    }

    context.restore();
  }
}