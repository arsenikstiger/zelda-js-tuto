import Point from "./Point.js";
import Rectangle from "./Rectangle.js";
import LayerObjectProperty from "./LayerObjectProperty.js";
import LayerObjectType from "../enums/LayerObjectType.js";

export default class LayerObject {
  public id: number;
  public name: string;
  public type: string;
  public visible: boolean;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public rotation: number;
  public point?: boolean;
  public properties?: LayerObjectProperty[];
  public polygon?: Point[];

  public get layerobjecttype(): LayerObjectType {
    if (this.point) return LayerObjectType.Point;
    if (this.polygon) return LayerObjectType.Polygon;
    return LayerObjectType.Rectangle;
  }

  public get rectangle(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
}
