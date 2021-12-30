import SpriteSheet from "./base/SpriteSheet.js";
import LevelData from "./LevelData.js";
import SpriteSheetData from "./SpriteSheetData.js";

export default class Level implements GameObject {
  public name: string;
  public tag: string;
  public width: number;
  public height: number;

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
  private spriteSheetTileWidth: number;
  private spriteSheetTileHeight: number;
  private spriteSheetColumnCount: number;
  private spriteSheetRowCount: number;

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

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    this.drawLayer(context, this.backgroundData);
    this.drawLayer(context, this.foregroundData);
    this.drawLayer(context, this.breakableData);
  }

  private async drawLayer(context: CanvasRenderingContext2D, layerData: number[]) {
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
