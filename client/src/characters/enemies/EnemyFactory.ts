import NonPlayingCharacterBase from "../../models/abstracts/NonPlayingCharacterBase.js";
import Alpha from "./Alpha.js";
import Beta from "./Beta.js";
import Delta from "./Delta.js";
import Gamma from "./Gamma.js";

export default class EnemyFactory {
  public static create(enemyType: string, x: number, y: number): NonPlayingCharacterBase {
    switch (enemyType) {
      case "Alpha":
        return new Alpha(x, y);
        break;
      case "Beta":
        return new Beta(x, y);
        break;
      case "Gamma":
        return new Gamma(x, y);
        break;
      case "Delta":
        return new Delta(x, y);
        break;
      default:
        return new Alpha(x, y);
        break;
    }
  }
}