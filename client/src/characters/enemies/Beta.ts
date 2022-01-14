import NonPlayingCharacterBase from "../../models/abstracts/NonPlayingCharacterBase.js";

export default class Beta extends NonPlayingCharacterBase {
  public constructor(
    x: number,
    y: number
  ) {
      super(
        "Beta",
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
          { x: 0, y: 7 },
          { x: 1, y: 7 },
          { x: 2, y: 7 },
        ],
        [
          { x: 0, y: 4 },
          { x: 1, y: 4 },
          { x: 2, y: 4 },
        ],
        [
          { x: 0, y: 5 },
          { x: 1, y: 5 },
          { x: 2, y: 5 },
        ],
        [
          { x: 0, y: 6 },
          { x: 1, y: 6 },
          { x: 2, y: 6 },
        ]
      );
  }
}