import EnemyBase from "../models/abstracts/EnemyBase.js";

export default class Alpha extends EnemyBase {
  public constructor(
    x: number,
    y: number
  ) {
      super(
        "Alpha",
        1,
        x,
        y,
        16,
        16,
        50,
        "spritesheets/enemies.png",
        12,
        8,
        [
          { x: 0, y: 3 },
          { x: 1, y: 3 },
          { x: 2, y: 3 },
        ],
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
        ],
        [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        [
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
        ]
      );
  }
}