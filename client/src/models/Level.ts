import DrawHelper from "../helpers/DrawHelper.js";
import LevelData from "./LevelData.js";

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
  public async initialize(): Promise<void> {
    const response = await window.fetch(`/levels/${this.name}.json`);
    const levelData = await (response.json() as Promise<LevelData>);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {}

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    DrawHelper.drawRectangle(
      context,
      0,
      0,
      this.width,
      this.height,
      this.color,
      1,
      this.color,
      false,
      true
    );
  }
}
