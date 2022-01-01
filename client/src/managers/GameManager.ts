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
    if (this.keyManager.up && this.keyManager.down) {
      // cancels vertical movement
    } else if (this.keyManager.up) {
      const result = await this.checkPlayerCanMove(deltaTime, totalTime, 0, -1);
      if (result.canMove) this.player.setPosition(result.futureRectangle);
    } else if (this.keyManager.down) {
      const result = await this.checkPlayerCanMove(deltaTime, totalTime, 0, 1);
      if (result.canMove) this.player.setPosition(result.futureRectangle);
    }

    if (this.keyManager.left && this.keyManager.right) {
      // cancels horizontal movement
    } else if (this.keyManager.left) {
      const result = await this.checkPlayerCanMove(deltaTime, totalTime, -1, 0);
      if (result.canMove) this.player.setPosition(result.futureRectangle);
    } else if (this.keyManager.right) {
      const result = await this.checkPlayerCanMove(deltaTime, totalTime, 1, 0);
      if (result.canMove) this.player.setPosition(result.futureRectangle);
    }

    await this.level.update(deltaTime, totalTime);
    await this.player.update(deltaTime, totalTime);
  }

  private async checkPlayerCanMove(
    deltaTime: number,
    totalTime: number,
    directionX: number,
    directionY: number
  ): Promise<{ canMove: boolean; futureRectangle?: Rectangle }> {
    const futureRectangle = this.player.getFutureRectangle(
      deltaTime,
      directionX,
      directionY
    );
    //on vérifie que le joueur ne sorte pas du terrain
    let collision = await this.level.hasCollisionInBackground(futureRectangle);
    if (!collision.hasAllCollision) return { canMove: false };

    //on vérifie que le joueur ne percute pas un élément de décor
    collision = await this.level.hasCollisionInForeground(futureRectangle);
    if (directionX < 0 && collision.hasCollisionAtW) return { canMove: false };
    if (directionX > 0 && collision.hasCollisionAtE) return { canMove: false };
    if (directionY < 0 && collision.hasCollisionAtN) return { canMove: false };
    if (directionY > 0 && collision.hasCollisionAtS) return { canMove: false };

    //on vérifie que le joueur ne percute pas un objet
    collision = await this.level.hasCollisionInBreakable(futureRectangle);
    if (directionX < 0 && collision.hasCollisionAtW) return { canMove: false };
    if (directionX > 0 && collision.hasCollisionAtE) return { canMove: false };
    if (directionY < 0 && collision.hasCollisionAtN) return { canMove: false };
    if (directionY > 0 && collision.hasCollisionAtS) return { canMove: false };

    return { canMove: true, futureRectangle: futureRectangle };
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    await this.level.draw(context);
    await this.player.draw(context);
  }
}
