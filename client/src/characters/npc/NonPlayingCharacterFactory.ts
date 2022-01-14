import NonPlayingCharacterBase from "../../models/abstracts/NonPlayingCharacterBase.js";
import Licorn from "./Licorn.js";

export default class EnemyFactory {
  public static create(enemyType: string, x: number, y: number): NonPlayingCharacterBase {
    switch (enemyType) {
      case "Licorn":
        return new Licorn(x, y);
        break;
      default:
        return new Licorn(x, y);
        break;
    }
  }
}