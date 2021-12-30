import MovableBase from "../abstracts/MovableBase.js";
import Sprite from "./base/Sprite.js";
import SpriteSheet from "./base/SpriteSheet.js";
import LevelData from "./LevelData.js";

export default class Player extends MovableBase implements GameObject {
  public name: string;
  public lives: number;
  public tag: string;

  public width: number;
  public height: number;

  private playerSpriteSheet: SpriteSheet;
  private playerSprite: Sprite;

  public constructor(
    name: string,
    lives: number,
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number
  ) {
    super(x, y, speed);

    this.name = name;
    this.lives = lives;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async initialize(context: CanvasRenderingContext2D): Promise<void> {
    this.playerSpriteSheet = new SpriteSheet("spritesheets/player2.png", 2, 4);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {
    await super.update(deltaTime, totalTime);
    this.playerSprite = new Sprite(this.playerSpriteSheet, 1, 3);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    await this.playerSprite.draw(
      context,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
