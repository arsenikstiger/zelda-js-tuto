import NonPlayingCharacterBase from "../../models/abstracts/NonPlayingCharacterBase.js";

export default class Gamma extends NonPlayingCharacterBase {
  public constructor(
    x: number,
    y: number
  ) {
      super(
        "Gamma",
        2,
        x,
        y,
        16,
        16,
        50,
        "spritesheets/enemies.png",
        12,
        8,
        [
          { x: 3, y: 7 },
          { x: 4, y: 7 },
          { x: 5, y: 7 },
        ],
        [
          { x: 3, y: 4 },
          { x: 4, y: 4 },
          { x: 5, y: 4 },
        ],
        [
          { x: 3, y: 5 },
          { x: 4, y: 5 },
          { x: 5, y: 5 },
        ],
        [
          { x: 3, y: 6 },
          { x: 4, y: 6 },
          { x: 5, y: 6 },
        ]
      );
  }
}