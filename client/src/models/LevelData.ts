import LayerBase from "./abstracts/LayerBase.js";
import TileSet from "./TileSet.js";

export default class LevelData {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: LayerBase[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: TileSet[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
}
