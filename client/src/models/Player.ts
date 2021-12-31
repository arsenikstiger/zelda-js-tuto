import MovableBase from "../abstracts/MovableBase.js";
import GameObject from "../interfaces/GameObject.js";
import Rectangle from "./base/Rectangle.js";
import Sprite from "./base/Sprite.js";
import SpriteSheet from "./base/SpriteSheet.js";

export default class Player extends MovableBase implements GameObject {
  public name: string;
  public lives: number;
  public tag: string;

  public get futureX(): number {
    return this._futureX;
  }
  public set futureX(value: number) {
    this._futureX = value;
    if (this.rectangle) this.rectangle.x = value;
  }

  public get futureY(): number {
    return this._futureY;
  }
  public set futureY(value: number) {
    this._futureY = value;
    if (this.rectangle) this.rectangle.y = value;
  }

  public width: number;
  public height: number;

  public rectangle: Rectangle;

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

    this.rectangle = new Rectangle(this.x, this.y, this.width, this.height);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async initialize(): Promise<void> {
    this.playerSpriteSheet = new SpriteSheet("spritesheets/player2.png", 2, 4);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {
    await super.update(deltaTime, totalTime);
    this.playerSprite = new Sprite(this.playerSpriteSheet, 1, 3);
  }

  public async intersect(collider: Rectangle): Promise<boolean> {
    return false;
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
