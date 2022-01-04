import LayerBase from "./abstracts/LayerBase.js";
import LayerObject from "./LayerObject.js";

export default class ObjectGroupLayer extends LayerBase {
  public draworder: string;
  public objects: LayerObject[];
}
