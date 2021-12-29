import DrawHelper from "../helpers/DrawHelper.js";

export default class Level implements GameObject {
  public name: string;
  public tag: string;

  public width: number;
  public height: number;
  public color: string;

  public constructor(
    name: string,
    width: number,
    height: number,
    color: string
  ) {
    this.name = name;

    this.width = width;
    this.height = height;

    this.color = color;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public initialize(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public update(deltaTime: number, totalTime: number): void {}

  public draw(context: CanvasRenderingContext2D): void {
    DrawHelper.drawRectangle(context, 0, 0, this.width, this.height, this.color, 1, this.color, false, true);
  }
}
