import Rectangle from "../models/base/Rectangle";

export default interface Collidable {
  hasCollision: (collider: Rectangle) => Promise<boolean>;
// eslint-disable-next-line semi
}
