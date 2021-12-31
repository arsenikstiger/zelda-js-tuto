import Collidable from "../interfaces/Collidable.js";
import GameObject from "../interfaces/GameObject.js";
import Rectangle from "./base/Rectangle.js";
import SpriteSheet from "./base/SpriteSheet.js";
import LevelData from "./LevelData.js";
import SpriteSheetData from "./SpriteSheetData.js";

export default class Level implements GameObject, Collidable {
  public name: string;
  public tag: string;
  public width: number;
  public height: number;

  public rectangle: Rectangle;

  public levelData: LevelData;
  public tileWidth: number;
  public tileHeight: number;
  public columnCount: number;
  public rowCount: number;

  public backgroundData: number[];
  public foregroundData: number[];
  public breakableData: number[];

  public levelSpriteSheet: SpriteSheet;
  public spriteSheetData: SpriteSheetData;
  public spriteSheetTileWidth: number;
  public spriteSheetTileHeight: number;
  public spriteSheetColumnCount: number;
  public spriteSheetRowCount: number;

  public constructor(name: string) {
    this.name = name;
  }

  public async initialize(): Promise<void> {
    const response = await window.fetch(`/levels/${this.name}.json`);
    this.levelData = await (response.json() as Promise<LevelData>);

    this.tileWidth = this.levelData.tilewidth;
    this.tileHeight = this.levelData.tileheight;
    this.columnCount = this.levelData.width;
    this.rowCount = this.levelData.height;

    this.width = this.tileWidth * this.columnCount;
    this.height = this.tileHeight * this.rowCount;

    this.rectangle = new Rectangle(0, 0, this.width, this.height);

    this.backgroundData = this.levelData.layers.find(
      (l) => l.name === "background"
    ).data;
    this.foregroundData = this.levelData.layers.find(
      (l) => l.name === "foreground"
    ).data;
    this.breakableData = this.levelData.layers.find(
      (l) => l.name === "breakable"
    ).data;

    const spriteSheetJson = this.levelData.tilesets[0].source.replace(
      "../",
      ""
    );

    const response2 = await window.fetch(spriteSheetJson);
    this.spriteSheetData = await (response2.json() as Promise<SpriteSheetData>);

    this.spriteSheetTileWidth = this.spriteSheetData.tilewidth;
    this.spriteSheetTileHeight = this.spriteSheetData.tileheight;
    this.spriteSheetColumnCount =
      this.spriteSheetData.imagewidth / this.spriteSheetTileWidth;
    this.spriteSheetRowCount =
      this.spriteSheetData.imageheight / this.spriteSheetTileHeight;

    const spriteSheetImage = `spritesheets/${this.spriteSheetData.image}`;
    this.levelSpriteSheet = new SpriteSheet(
      spriteSheetImage,
      this.spriteSheetColumnCount,
      this.spriteSheetRowCount
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {}

  public async hasCollision(collider: Rectangle): Promise<boolean> {
    return true;
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    this.drawLayer(context, this.backgroundData);
    this.drawLayer(context, this.foregroundData);
    this.drawLayer(context, this.breakableData);
  }

  private async drawLayer(
    context: CanvasRenderingContext2D,
    layerData: number[]
  ) {
    for (let i = 0; i < layerData.length; i++) {
      const tileNumber = i;
      const tileColumn = tileNumber % this.columnCount;
      const tileRow = Math.floor(tileNumber / this.columnCount);

      const spriteNumber = layerData[i] - 1;
      const spriteColumn = spriteNumber % this.spriteSheetColumnCount;
      const spriteRow = Math.floor(spriteNumber / this.spriteSheetColumnCount);

      this.levelSpriteSheet.drawSprite(
        context,
        spriteColumn,
        spriteRow,
        tileColumn * this.tileWidth,
        tileRow * this.tileHeight,
        this.tileWidth,
        this.tileHeight
      );
    }
  }
}
