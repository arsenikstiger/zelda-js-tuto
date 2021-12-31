export default class RectangleCollision {
  public nw: boolean;
  public ne: boolean;
  public sw: boolean;
  public se: boolean;

  public get isColliding(): boolean {
    return this.nw || this.ne || this.sw || this.se;
  }

  public constructor(nw: boolean, ne: boolean, sw: boolean, se: boolean) {
    this.nw = nw;
    this.ne = ne;
    this.sw = sw;
    this.se = se;
  }
}