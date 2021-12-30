import DrawHelper from "../helpers/DrawHelper.js";
import KeyManager from "../managers/KeyManager.js";
import Level from "../models/Level.js";
import Player from "../models/Player.js";

export default class GameManager implements GameObject {
  public keyManager: KeyManager;
  public level: Level;
  public player: Player;
  public tag: string;

  public async initialize(context: CanvasRenderingContext2D): Promise<void> {
    this.keyManager = new KeyManager();
    await this.keyManager.initialize(context);

    this.level = new Level("level2");
    await this.level.initialize(context);

    this.player = new Player("As", 3, 0, 0, 16, 16, 50);
    await this.player.initialize(context);

    context.canvas.width = this.level.width;
    context.canvas.height = this.level.height;
  }

  public async update(deltaTime: number, totalTime: number): Promise<void> {
    if (this.keyManager.up) this.player.moveUp(deltaTime);
    if (this.keyManager.down) this.player.moveDown(deltaTime);
    if (this.keyManager.left) this.player.moveLeft(deltaTime);
    if (this.keyManager.right) this.player.moveRight(deltaTime);

    await this.level.update(deltaTime, totalTime);
    await this.player.update(deltaTime, totalTime);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    await this.level.draw(context);
    await this.player.draw(context);
  }
}
