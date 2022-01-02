import MovableBase from "./MovableBase.js";
import GameObject from "../interfaces/GameObject.js";
import Sprite from "../models/base/Sprite.js";
import SpriteSheet from "../models/base/SpriteSheet.js";
import Point from "../models/base/Point.js";
import RecurringTimer from "../models/RecurringTimer.js";

export default abstract class Character extends MovableBase implements GameObject {
  public name: string;
  public lives: number;
  public tag: string;

  private characterSpriteSheet: SpriteSheet;
  private characterSprite: Sprite;
  private characterSpritePoint: Point;
  private upAnimation: Point[];
  private downAnimation: Point[];
  private leftAnimation: Point[];
  private rightAnimation: Point[];

  private animationNumber: number;

  private recurringTimer: RecurringTimer;

  public constructor(
    name: string,
    lives: number,

    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,

    spriteSheetImage: string,
    spriteSheetColumnCount: number,
    spriteSheetRowCount: number,

    upAnimation: Point[],
    downAnimation: Point[],
    leftAnimation: Point[],
    rightAnimation: Point[]
  ) {
    super(x, y, width, height, speed);

    this.name = name;
    this.lives = lives;

    this.characterSpriteSheet = new SpriteSheet(
      spriteSheetImage,
      spriteSheetColumnCount,
      spriteSheetRowCount
    );

    this.animationNumber = 0;

    this.upAnimation = upAnimation;
    this.downAnimation = downAnimation;
    this.leftAnimation = leftAnimation;
    this.rightAnimation = rightAnimation;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async initialize(): Promise<void> {
    this.recurringTimer = new RecurringTimer(300);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {
    await this.recurringTimer.update(deltaTime, totalTime);

    if (this.recurringTimer.hasElapsed) {
      this.animationNumber += 1;
    }

    if (this.directionY < 0) {
      this.characterSpritePoint =
        this.upAnimation[this.animationNumber % this.upAnimation.length];
      console.log("UP");
    } else if (this.directionY > 0) {
      this.characterSpritePoint =
        this.downAnimation[this.animationNumber % this.downAnimation.length];
    } else if (this.directionX < 0) {
      this.characterSpritePoint =
        this.leftAnimation[this.animationNumber % this.leftAnimation.length];
    } else if (this.directionX > 0) {
      this.characterSpritePoint =
        this.rightAnimation[this.animationNumber % this.rightAnimation.length];
    } else if (!this.characterSpritePoint) {
      this.characterSpritePoint =
        this.downAnimation[this.animationNumber % this.downAnimation.length];
    }

    this.characterSprite = new Sprite(
      this.characterSpriteSheet,
      this.characterSpritePoint.x,
      this.characterSpritePoint.y
    );

    await super.update(deltaTime, totalTime);
  }

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    await this.characterSprite.draw(
      context,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
