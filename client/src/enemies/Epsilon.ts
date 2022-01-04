import EnemyBase from "../models/abstracts/EnemyBase.js";

export default class Epsilon extends EnemyBase {
  public constructor(
    x: number,
    y: number
  ) {
      super(
        "Epsilon",
        5,
        x,
        y,
        16,
        16,
        50,
        "spritesheets/enemies.png",
        12,
        8,
        [
          { x: 9, y: 7 },
          { x: 10, y: 7 },
          { x: 11, y: 7 },
        ],
        [
          { x: 9, y: 4 },
          { x: 10, y: 4 },
          { x: 11, y: 4 },
        ],
        [
          { x: 9, y: 5 },
          { x: 10, y: 5 },
          { x: 11, y: 5 },
        ],
        [
          { x: 9, y: 6 },
          { x: 10, y: 6 },
          { x: 11, y: 6 },
        ]
      );
  }
}