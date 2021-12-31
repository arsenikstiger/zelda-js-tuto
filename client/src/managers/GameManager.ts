import GameObject from "../interfaces/GameObject.js";
import KeyManager from "../managers/KeyManager.js";
import Rectangle from "../models/base/Rectangle.js";
import Level from "../models/Level.js";
import Player from "../models/Player.js";

export default class GameManager implements GameObject {
  public keyManager: KeyManager;
  public level: Level;
  public player: Player;
  public tag: string;
  public rectangle: Rectangle;

  public context: CanvasRenderingContext2D;

  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public async initialize(): Promise<void> {
    this.keyManager = new KeyManager();
    await this.keyManager.initialize();

    this.level = new Level("level2");
    await this.level.initialize();

    this.player = new Player("As", 3, 0, 0, 16, 16, 50);
    await this.player.initialize();

    this.rectangle = this.level.rectangle;

    this.context.canvas.width = this.level.width;
    this.context.canvas.height = this.level.height;
  }

  public async update(deltaTime: number, totalTime: number): Promise<void> {
    if (this.keyManager.up) this.player.moveUp(deltaTime);
    if (this.keyManager.down) this.player.moveDown(deltaTime);
    if (this.keyManager.left) this.player.moveLeft(deltaTime);
    if (this.keyManager.right) this.player.moveRight(deltaTime);

    if (await this.level.hasCollision(this.player.rectangle)) {
      this.player.cancelMove(deltaTime);
    }

    await this.level.update(deltaTime, totalTime);
    await this.player.update(deltaTime, totalTime);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    await this.level.draw(context);
    await this.player.draw(context);
  }

  // private async checkPlayerCollision() {
  //   const column = Math.floor(this.player.futureX / this.level.tileWidth);
  //   const row = Math.floor(this.player.futureY / this.level.tileHeight);
  //   const tileNumber = row * this.level.columnCount + column;

  //   if (this.level.foregroundData[tileNumber] > 0) {
  //     this.player.cancelMove(deltaTime);
  //     console.log(
  //       `tileNumber:${tileNumber} = ${this.level.foregroundData[tileNumber]}`
  //     );
  //   }
  // }
}
