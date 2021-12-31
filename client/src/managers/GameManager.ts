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
    this.player.x = this.level.width / 2 - this.player.width / 2;
    this.player.y = this.level.height / 2 - this.player.height / 2;
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

    // Si on sort du background, on annule le mouvement
    if (!await this.level.contains(this.player.rectangle)) this.player.cancelMove(deltaTime);
    // Si on passe à travers des cases occupées, on annule le mouvement
    if (await this.level.intersectForeground(this.player.rectangle)) this.player.cancelMove(deltaTime);
    if (await this.level.intersectBreakable(this.player.rectangle)) this.player.cancelMove(deltaTime);

    await this.level.update(deltaTime, totalTime);
    await this.player.update(deltaTime, totalTime);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    await this.level.draw(context);
    await this.player.draw(context);
  }
}
