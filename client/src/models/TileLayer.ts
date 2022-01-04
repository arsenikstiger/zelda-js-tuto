import LayerBase from "./abstracts/LayerBase.js";
import Rectangle from "./Rectangle.js";

export default class TileLayer extends LayerBase {
  public width: number;
  public height: number;
  public data: number[];
  public tintcolor?: string;

  public get rectangle(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
}
