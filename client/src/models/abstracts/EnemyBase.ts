import CharacterBase from "./CharacterBase.js";
import Point from "../Point.js";

export default abstract class EnemyBase extends CharacterBase {
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
    super(
      name,
      lives,
      x,
      y,
      width,
      height,
      speed,
      spriteSheetImage,
      spriteSheetColumnCount,
      spriteSheetRowCount,
      upAnimation,
      downAnimation,
      leftAnimation,
      rightAnimation
    );
  }
}
