import NonPlayingCharacterBase from "../../models/abstracts/NonPlayingCharacterBase.js";

export default class Alpha extends NonPlayingCharacterBase {
  public constructor(
    x: number,
    y: number
  ) {
      super(
        "Licorn",
        1,
        x,
        y,
        16,
        16,
        50,
        "objects/Heart2.png",
        1,
        1,
        [
          { x: 0, y: 0 },
        ],
        [
          { x: 0, y: 0 },
        ],
        [
          { x: 0, y: 0 },
        ],
        [
          { x: 0, y: 0 },
        ]
      );
  }
}