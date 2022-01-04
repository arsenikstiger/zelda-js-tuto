import CollisionHelper from "../helpers/CollisionHelper.js";
import GameObject from "../models/interfaces/GameObject.js";
import LayerObject from "../models/LayerObject.js";
import LevelData from "../models/LevelData.js";
import ObjectGroupLayer from "../models/ObjectGroupLayer.js";
import Point from "../models/Point.js";
import Rectangle from "../models/Rectangle.js";
import RectangleCollision from "../models/RectangleCollision.js";
import SpriteSheet from "../models/SpriteSheet.js";
import SpriteSheetData from "../models/SpriteSheetData.js";
import TileLayer from "../models/TileLayer.js";

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

  public backgroundLayers: TileLayer[];
  public collisionsLayer: ObjectGroupLayer;
  public positionsLayer: ObjectGroupLayer;

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

    // Get layers
    this.backgroundLayers = <TileLayer[]>(
      this.levelData.layers.filter((l) => l.type === "tilelayer")
    );

    this.collisionsLayer = <ObjectGroupLayer>(
      this.levelData.layers.find(
        (l) => l.type === "objectgroup" && l.name === "collisions"
      )
    );

    this.positionsLayer = <ObjectGroupLayer>(
      this.levelData.layers.find(
        (l) => l.type === "objectgroup" && l.name === "positions"
      )
    );

    // Prepare background layers (fix json to real object)
    const jsonBackgroundLayers = this.backgroundLayers;
    const realBackgroundLayers: TileLayer[] = [];
    for (const layer of jsonBackgroundLayers) {
      realBackgroundLayers.push(Object.assign(new TileLayer(), layer));
    }
    this.backgroundLayers = realBackgroundLayers;

    // Prepare collisions layer (fix json to real object)
    const jsonLayerObjects = this.collisionsLayer.objects;
    const realLayerObjects: LayerObject[] = [];
    for (const o of jsonLayerObjects) {
      realLayerObjects.push(Object.assign(new LayerObject(), o));
    }
    this.collisionsLayer.objects = realLayerObjects;

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
  public async beforeupdate(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {}

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.drawImage(this.bufferCanvas, 0, 0, this.width, this.height);
  }

  public async isInside(collider: Rectangle): Promise<RectangleCollision> {
    const nw = CollisionHelper.isPointInRectangle(collider.nw, this.rectangle);
    const ne = CollisionHelper.isPointInRectangle(collider.ne, this.rectangle);
    const sw = CollisionHelper.isPointInRectangle(collider.sw, this.rectangle);
    const se = CollisionHelper.isPointInRectangle(collider.se, this.rectangle);

    const rectangleCollision = new RectangleCollision(nw, ne, sw, se);
    return rectangleCollision;
  }

  public async hasCollisionWithBackground(
    collider: Rectangle
  ): Promise<RectangleCollision> {
    const nw = this.collisionsLayer.objects.some((c: LayerObject) =>
      CollisionHelper.isPointInRectangle(
        collider.nw,
        (c as LayerObject).rectangle
      )
    );
    const ne = this.collisionsLayer.objects.some((c: LayerObject) =>
      CollisionHelper.isPointInRectangle(
        collider.ne,
        (c as LayerObject).rectangle
      )
    );
    const sw = this.collisionsLayer.objects.some((c: LayerObject) =>
      CollisionHelper.isPointInRectangle(
        collider.sw,
        (c as LayerObject).rectangle
      )
    );
    const se = this.collisionsLayer.objects.some((c: LayerObject) =>
      CollisionHelper.isPointInRectangle(
        collider.se,
        (c as LayerObject).rectangle
      )
    );

    const rectangleCollision = new RectangleCollision(nw, ne, sw, se);
    return rectangleCollision;
  }

  private async initializeBuffer(): Promise<void> {
    for (const backgroundData of this.backgroundLayers) {
      await this.drawLayer(this.bufferContext, backgroundData.data);
    }
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
    // Bits on the far end of the 32-bit global tile ID are used for tile flags
    const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    const FLIPPED_VERTICALLY_FLAG = 0x40000000;
    const FLIPPED_DIAGONALLY_FLAG = 0x20000000;
    const ROTATED_HEXAGONAL_120_FLAG = 0x10000000;

    for (let i = 0; i < layerData.length; i++) {
      const tileNumber = i;
      const tileColumn = tileNumber % this.columnCount;
      const tileRow = Math.floor(tileNumber / this.columnCount);

      const value = layerData[i] - 1;

      // Read out the flags
      const flipped_horizontally: boolean =
        (value & FLIPPED_HORIZONTALLY_FLAG) === 0 ? false : true;
      const flipped_vertically: boolean =
        (value & FLIPPED_VERTICALLY_FLAG) === 0 ? false : true;
      const flipped_diagonally: boolean =
        (value & FLIPPED_DIAGONALLY_FLAG) === 0 ? false : true;
      const rotated_hex120: boolean =
        (value & ROTATED_HEXAGONAL_120_FLAG) === 0 ? false : true;

      // Clear all four flags
      const spriteNumber =
        value &
        ~(
          FLIPPED_HORIZONTALLY_FLAG |
          FLIPPED_VERTICALLY_FLAG |
          FLIPPED_DIAGONALLY_FLAG |
          ROTATED_HEXAGONAL_120_FLAG
        );

      const spriteColumn = spriteNumber % this.spriteSheetColumnCount;
      const spriteRow = Math.floor(spriteNumber / this.spriteSheetColumnCount);

      this.levelSpriteSheet.draw(
        context,
        spriteColumn,
        spriteRow,
        tileColumn * this.tileWidth,
        tileRow * this.tileHeight,
        this.tileWidth,
        this.tileHeight,
        flipped_diagonally ? 270 : 0,
        flipped_horizontally,
        flipped_vertically,
        false
      );
    }
  }
}
