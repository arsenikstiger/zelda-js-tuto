import Rectangle from "./Rectangle.js";

export default class MoveResult {
  public directionX: number;
  public directionY: number;
  public futureRectangle?: Rectangle;
  public canMove: boolean;
  public mustChangeLevel?: boolean;
}
