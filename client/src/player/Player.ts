import Character from "../models/abstracts/CharacterBase.js";

export default class Player extends Character {
  public constructor(
    name: string,
    lives: number,
    x: number,
    y: number,
  ) {
    super(
      name,
      lives,
      x,
      y,
      16,
      16,
      50,
      "spritesheets/player2.png",
      2,
      4,
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: 3 },
        { x: 1, y: 3 },
      ],
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
      ]
    );
  }
}
