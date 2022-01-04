import GameObject from "../models/interfaces/GameObject.js";
import KeyManager from "../managers/KeyManager.js";
import EnemyBase from "../models/abstracts/EnemyBase.js";
import Level from "../level/Level.js";
import Rectangle from "../models/Rectangle.js";
import Player from "../player/Player.js";
import MoveResult from "../models/MoveResult.js";
import EnemyFactory from "../enemies/EnemyFactory.js";

export default class GameManager implements GameObject {
  public keyManager: KeyManager;
  public level: Level;
  public player: Player;
  public enemies: EnemyBase[];
  public tag: string;
  public rectangle: Rectangle;

  public context: CanvasRenderingContext2D;

  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public async initialize(): Promise<void> {
    this.keyManager = new KeyManager();
    await this.keyManager.initialize();

    this.player = new Player("As", 3, 0, 0);
    await this.player.initialize();

    await this.initializeLevel();
    this.rectangle = this.level.rectangle;
    this.context.canvas.width = this.level.width;
    this.context.canvas.height = this.level.height;
  }

  public async beforeupdate(): Promise<void> {
    await this.level.beforeupdate();
    for (const enemy of this.enemies) {
      await enemy.beforeupdate();
    }
    await this.player.beforeupdate();
  }

  public async update(deltaTime: number, totalTime: number): Promise<void> {
    if (this.keyManager.up && this.keyManager.down) {
      // cancels vertical movement
    } else if (this.keyManager.up) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, 0, -1);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
      if (result.mustChangeLevel) return await this.initializeLevel(result);
    } else if (this.keyManager.down) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, 0, 1);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
      if (result.mustChangeLevel) return await this.initializeLevel(result);
    }

    if (this.keyManager.left && this.keyManager.right) {
      // cancels horizontal movement
    } else if (this.keyManager.left) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, -1, 0);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
      if (result.mustChangeLevel) return await this.initializeLevel(result);
    } else if (this.keyManager.right) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, 1, 0);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
      if (result.mustChangeLevel) return await this.initializeLevel(result);
    }

    for (const enemy of this.enemies) {
      await enemy.move(deltaTime, 1, 0);
    }

    await this.level.update(deltaTime, totalTime);
    for (const enemy of this.enemies) {
      await enemy.update(deltaTime, totalTime);
    }
    await this.player.update(deltaTime, totalTime);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    await this.level.draw(context);
    for (const enemy of this.enemies) {
      await enemy.draw(context);
    }
    await this.player.draw(context);
  }

  private async checkPlayerMove(
    deltaTime: number,
    totalTime: number,
    directionX: number,
    directionY: number
  ): Promise<MoveResult> {
    const futureRectangle = await this.player.getFutureRectangle(
      deltaTime,
      directionX,
      directionY
    );
    //on vérifie que le joueur ne sorte pas du terrain
    let insideCollision = await this.level.isInside(futureRectangle);
    if (!insideCollision.hasAllCollision)
      return { directionX, directionY, canMove: false, mustChangeLevel: true };

    //on vérifie que le joueur ne percute pas un élément de décor
    insideCollision = await this.level.hasCollisionWithBackground(
      futureRectangle
    );
    if (directionX < 0 && insideCollision.hasCollisionAtW)
      return { directionX, directionY, canMove: false };
    if (directionX > 0 && insideCollision.hasCollisionAtE)
      return { directionX, directionY, canMove: false };
    if (directionY < 0 && insideCollision.hasCollisionAtN)
      return { directionX, directionY, canMove: false };
    if (directionY > 0 && insideCollision.hasCollisionAtS)
      return { directionX, directionY, canMove: false };

    return {
      directionX,
      directionY,
      canMove: true,
      futureRectangle: futureRectangle,
    };
  }

  private async initializeLevel(moveResult?: MoveResult): Promise<void> {
    if (!moveResult) {
      this.level = new Level("level2");
      await this.level.initialize();

      const playerPosition = this.level.positionsLayer.objects.find(
        (o) => o.type === "Player" && o.name === "player" && o.point
      );
      await this.player.setXY(playerPosition.x, playerPosition.y);
    } else {
      this.level = new Level("level3");
      await this.level.initialize();

      if (moveResult.directionX < 0) {
        await this.player.setXY(
          this.level.width - this.player.width,
          this.player.y
        );
      } else if (moveResult.directionX > 0) {
        await this.player.setXY(0, this.player.y);
      } else if (moveResult.directionY < 0) {
        await this.player.setXY(
          this.player.x,
          this.level.height - this.player.height
        );
      } else if (moveResult.directionY > 0) {
        await this.player.setXY(this.player.x, 0);
      }
    }

    this.enemies = [];
    const enemyPositions = this.level.positionsLayer.objects.filter(
      (o) => o.type === "Enemy" && o.point
    );
    for (const enemyPosition of enemyPositions) {
      const enemy = EnemyFactory.create(enemyPosition.name, enemyPosition.x, enemyPosition.y);
      await enemy.initialize();
      this.enemies.push(enemy);
    }
  }
}
