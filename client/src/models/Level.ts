import GameObject from "../interfaces/GameObject.js";
import Point from "./base/Point.js";
import Rectangle from "./base/Rectangle.js";
import RectangleCollision from "./base/RectangleCollision.js";
import SpriteSheet from "./base/SpriteSheet.js";
import LevelData from "./LevelData.js";
import SpriteSheetData from "./SpriteSheetData.js";

export default class Level implements GameObject {
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

  private bufferCanvas: HTMLCanvasElement;
  private bufferContext: CanvasRenderingContext2D;

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

    if (this.bufferCanvas) this.bufferCanvas.remove();
    this.bufferCanvas = document.createElement("canvas") as HTMLCanvasElement;
    this.bufferCanvas.width = this.width;
    this.bufferCanvas.height = this.height;
    this.bufferContext = this.bufferCanvas.getContext("2d");

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
    this.spriteSheetColumnCount = Math.floor(
      this.spriteSheetData.imagewidth / this.spriteSheetTileWidth
    );
    this.spriteSheetRowCount = Math.floor(
      this.spriteSheetData.imageheight / this.spriteSheetTileHeight
    );

    const spriteSheetImage = `spritesheets/${this.spriteSheetData.image}`;
    this.levelSpriteSheet = new SpriteSheet(
      spriteSheetImage,
      this.spriteSheetColumnCount,
      this.spriteSheetRowCount,
      async () => await this.initializeBuffer()
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {}

  public async hasCollisionInBackground(
    collider: Rectangle
  ): Promise<RectangleCollision> {
    let tile = await this.tileNumberFromPoint(collider.nw);
    const nw = tile != -1;

    tile = await this.tileNumberFromPoint(collider.ne);
    const ne = tile != -1;

    tile = await this.tileNumberFromPoint(collider.sw);
    const sw = tile != -1;

    tile = await this.tileNumberFromPoint(collider.se);
    const se = tile != -1;

    const rectangleCollision = new RectangleCollision(nw, ne, sw, se);
    return rectangleCollision;
  }

  public async hasCollisionInForeground(
    collider: Rectangle
  ): Promise<RectangleCollision> {
    let tile = await this.tileNumberFromPoint(collider.nw);
    const nw = this.foregroundData[tile] > 0;

    tile = await this.tileNumberFromPoint(collider.ne);
    const ne = this.foregroundData[tile] > 0;

    tile = await this.tileNumberFromPoint(collider.sw);
    const sw = this.foregroundData[tile] > 0;

    tile = await this.tileNumberFromPoint(collider.se);
    const se = this.foregroundData[tile] > 0;

    const rectangleCollision = new RectangleCollision(nw, ne, sw, se);
    return rectangleCollision;
  }

  public async hasCollisionInBreakable(
    collider: Rectangle
  ): Promise<RectangleCollision> {
    let tile = await this.tileNumberFromPoint(collider.nw);
    const nw = this.breakableData[tile] > 0;

    tile = await this.tileNumberFromPoint(collider.ne);
    const ne = this.breakableData[tile] > 0;

    tile = await this.tileNumberFromPoint(collider.sw);
    const sw = this.breakableData[tile] > 0;

    tile = await this.tileNumberFromPoint(collider.se);
    const se = this.breakableData[tile] > 0;

    const rectangleCollision = new RectangleCollision(nw, ne, sw, se);
    return rectangleCollision;
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.drawImage(this.bufferCanvas, 0, 0, this.width, this.height);
    await this.drawLayer(context, this.breakableData);
  }

  private async initializeBuffer(): Promise<void> {
    await this.drawLayer(this.bufferContext, this.backgroundData);
    await this.drawLayer(this.bufferContext, this.foregroundData);
  }

  private async tileNumberFromPoint(point: Point): Promise<number> {
    const column = Math.floor(point.x / this.tileWidth);
    const row = Math.floor(point.y / this.tileHeight);

    if (column < 0 || column >= this.columnCount) return -1;
    if (row < 0 || row >= this.rowCount) return -1;

    const tileNumber = row * this.columnCount + column;
    return tileNumber;
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
