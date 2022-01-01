export default class RectangleCollision {
  public hasCollisionAtNW: boolean;
  public hasCollisionAtNE: boolean;
  public hasCollisionAtSW: boolean;
  public hasCollisionAtSE: boolean;

  public get hasCollisionAtN(): boolean {
    return this.hasCollisionAtNW || this.hasCollisionAtNE;
  }

  public get hasCollisionAtS(): boolean {
    return this.hasCollisionAtSW || this.hasCollisionAtSE;
  }

  public get hasCollisionAtW(): boolean {
    return this.hasCollisionAtNW || this.hasCollisionAtSW;
  }

  public get hasCollisionAtE(): boolean {
    return this.hasCollisionAtNE || this.hasCollisionAtSE;
  }

  public get hasAnyCollision(): boolean {
    return (
      this.hasCollisionAtNW ||
      this.hasCollisionAtNE ||
      this.hasCollisionAtSW ||
      this.hasCollisionAtSE
    );
  }

  public get hasAllCollision(): boolean {
    return (
      this.hasCollisionAtNW &&
      this.hasCollisionAtNE &&
      this.hasCollisionAtSW &&
      this.hasCollisionAtSE
    );
  }

  public constructor(nw: boolean, ne: boolean, sw: boolean, se: boolean) {
    this.hasCollisionAtNW = nw;
    this.hasCollisionAtNE = ne;
    this.hasCollisionAtSW = sw;
    this.hasCollisionAtSE = se;
  }
}