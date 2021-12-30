import DrawHelper from "../helpers/DrawHelper.js";
import SpriteSheet from "./base/SpriteSheet.js";
import LevelData from "./LevelData.js";

export default class Level implements GameObject {
  public name: string;
  public tag: string;
  public width: number;
  public height: number;
  public color: string;

  private levelData: LevelData;
  private tileWidth: number;
  private tileHeight: number;
  private columnCount: number;
  private rowCount: number;
  private backgroundData: number[];
  private foregroundData: number[];
  private breakableData: number[];
  private levelSpriteSheet: SpriteSheet;
  private spriteSheetData: SpriteSheetData;

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

  public async initialize(): Promise<void> {
    const response = await window.fetch(`/levels/${this.name}.json`);
    this.levelData = await (response.json() as Promise<LevelData>);

    this.tileWidth = this.levelData.tilewidth;
    this.tileHeight = this.levelData.tileheight;
    this.columnCount = this.levelData.width;
    this.rowCount = this.levelData.height;

    this.backgroundData = this.levelData.layers.find(
      (l) => l.name === "background"
    ).data;
    this.foregroundData = this.levelData.layers.find(
      (l) => l.name === "foreground"
    ).data;
    this.breakableData = this.levelData.layers.find(
      (l) => l.name === "breakable"
    ).data;

    const spriteSheet = this.levelData.tilesets[0].source.replace("../", "");

    const response2 = await window.fetch(spriteSheet);
    this.spriteSheetData = await (response2.json() as Promise<SpriteSheetData>);

    this.levelSpriteSheet = new SpriteSheet(spriteSheet, 2, 4);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {}

  public async draw(context: CanvasRenderingContext2D): Promise<void> {}
}
