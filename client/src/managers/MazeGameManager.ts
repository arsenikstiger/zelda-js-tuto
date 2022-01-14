import GameObject from "../models/interfaces/GameObject.js";
import KeyManager from "./KeyManager.js";
import NonPlayingCharacterBase from "../models/abstracts/NonPlayingCharacterBase.js";
import Level from "../level/Level.js";
import Rectangle from "../models/Rectangle.js";
import Player from "../characters/player/Player.js";
import MoveResult from "../models/MoveResult.js";
import Maze from "../world/maze.js";
import NonPlayingCharacterFactory from "../characters/npc/NonPlayingCharacterFactory.js";
import CollisionHelper from "../helpers/CollisionHelper.js";
import RecurringTimer from "../models/RecurringTimer.js";
import WinWindow from "../windows/winwindow.js";

export default class MazeGameManager implements GameObject {
  public keyManager: KeyManager;
  public maze: Maze;
  public level: Level;
  public player: Player;
  public goal: NonPlayingCharacterBase;
  public tag: string;
  public rectangle: Rectangle;
  public hasWon: boolean;

  private winWindow: WinWindow;

  public context: CanvasRenderingContext2D;

  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public async initialize(): Promise<void> {
    this.keyManager = new KeyManager();
    await this.keyManager.initialize();

    this.player = new Player("As", 3, 0, 0, 200);
    await this.player.initialize();

    await this.initializeMaze();
    this.rectangle = this.level.rectangle;
    this.context.canvas.width = this.level.width;
    this.context.canvas.height = this.level.height;

    this.hasWon = false;
    this.winWindow = new WinWindow(
      "Félicitations !",
      0,
      0,
      this.rectangle.width,
      this.rectangle.height,
      "Rejouer"
    );
    await this.winWindow.initialize();
  }

  public async beforeupdate(): Promise<void> {
    await this.level.beforeupdate();
    await this.goal.beforeupdate();
    await this.player.beforeupdate();
  }

  public async update(deltaTime: number, totalTime: number): Promise<void> {
    if (this.hasWon) await this.updateWinScreen(deltaTime, totalTime);
    else await this.updateGameScreen(deltaTime, totalTime);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (this.hasWon) await this.drawWinScreen(context);
    else await this.drawGameScreen(context);
  }

  private async updateGameScreen(
    deltaTime: number,
    totalTime: number
  ): Promise<void> {
    if (this.keyManager.up && this.keyManager.down) {
      // cancels vertical movement
    } else if (this.keyManager.up) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, 0, -1);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
    } else if (this.keyManager.down) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, 0, 1);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
    }

    if (this.keyManager.left && this.keyManager.right) {
      // cancels horizontal movement
    } else if (this.keyManager.left) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, -1, 0);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
    } else if (this.keyManager.right) {
      const result = await this.checkPlayerMove(deltaTime, totalTime, 1, 0);
      if (result.canMove) await this.player.setPosition(result.futureRectangle);
    }

    // on vérifie que le joueur touche l'arrivée
    const goalCollision = CollisionHelper.isRectangleInRectangle(
      this.player.rectangle,
      this.goal.rectangle
    );
    if (goalCollision) {
      this.hasWon = true;
    }

    await this.level.update(deltaTime, totalTime);
    await this.goal.update(deltaTime, totalTime);
    await this.player.update(deltaTime, totalTime);
  }

  private async updateWinScreen(
    deltaTime: number,
    totalTime: number
  ): Promise<void> {
    if (this.keyManager.enter) this.winWindow.valid();

    if (this.winWindow.buttonClicked) {
      window.location.href = window.location.href;
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    await this.level.update(deltaTime, totalTime);
    await this.goal.update(deltaTime, totalTime);
    await this.player.update(deltaTime, totalTime);
    await this.winWindow.update(deltaTime, totalTime);
  }

  private async drawGameScreen(
    context: CanvasRenderingContext2D
  ): Promise<void> {
    await this.level.draw(context);
    await this.goal.draw(context);
    await this.player.draw(context);
  }

  private async drawWinScreen(
    context: CanvasRenderingContext2D
  ): Promise<void> {
    await this.level.draw(context);
    await this.goal.draw(context);
    await this.player.draw(context);
    await this.winWindow.draw(context);
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

    // on vérifie que le joueur ne sorte pas du terrain
    let insideCollision = await this.level.isInside(futureRectangle);
    if (!insideCollision.hasAllCollision)
      return { directionX, directionY, canMove: false, mustChangeLevel: true };

    // on vérifie que le joueur ne percute pas un élément de décor
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

  private async initializeMaze(): Promise<void> {
    this.maze = new Maze(5, 5, 0, 0, 4, 4);
    this.maze.generate();
    const json = this.maze.toJson();

    // Level
    this.level = new Level("", json);
    await this.level.initialize();

    // Player
    const playerPosition = this.level.positionsLayer.objects.find(
      (o) => o.type === "Start" && o.name === "Player" && o.point
    );
    await this.player.setXY(playerPosition.x, playerPosition.y);

    // Goal
    const goalPosition = this.level.positionsLayer.objects.find(
      (o) => o.type === "End" && o.point
    );
    this.goal = NonPlayingCharacterFactory.create(
      goalPosition.name,
      goalPosition.x,
      goalPosition.y
    );
    await this.goal.initialize();
  }
}
