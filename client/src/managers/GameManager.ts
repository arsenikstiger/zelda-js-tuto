import KeyManager from "../managers/KeyManager.js";
import Level from "../models/Level.js";
import Player from "../models/Player.js";

export default class GameManager implements GameObject {
  public keyManager: KeyManager;
  public level: Level;
  public player: Player;
  public tag: string;

  public initialize(): void {
    this.keyManager = new KeyManager();
    this.keyManager.initialize();

    this.level = new Level("Début de l'histoire", 200, 200, "green");
    this.level.initialize();

    this.player = new Player("As", 3, 0, 0, 16, 16, 50);
    this.player.initialize();
  }

  public update(deltaTime: number, totalTime: number): void {
    if (this.keyManager.up) this.player.moveUp(deltaTime);
    if (this.keyManager.down) this.player.moveDown(deltaTime);
    if (this.keyManager.left) this.player.moveLeft(deltaTime);
    if (this.keyManager.right) this.player.moveRight(deltaTime);

    this.level.update(deltaTime, totalTime);
    this.player.update(deltaTime, totalTime);
  }

  public draw(context: CanvasRenderingContext2D): void {
    this.level.draw(context);
    this.player.draw(context);
  }
}
