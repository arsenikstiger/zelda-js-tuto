import EnemyBase from "../models/abstracts/EnemyBase.js";

export default class Delta extends EnemyBase {
  public constructor(
    x: number,
    y: number
  ) {
      super(
        "Delta",
        3,
        x,
        y,
        16,
        16,
        50,
        "spritesheets/enemies.png",
        12,
        8,
        [
          { x: 6, y: 7 },
          { x: 7, y: 7 },
          { x: 8, y: 7 },
        ],
        [
          { x: 6, y: 4 },
          { x: 7, y: 4 },
          { x: 8, y: 4 },
        ],
        [
          { x: 6, y: 5 },
          { x: 7, y: 5 },
          { x: 8, y: 5 },
        ],
        [
          { x: 6, y: 6 },
          { x: 7, y: 6 },
          { x: 8, y: 6 },
        ]
      );
  }
}