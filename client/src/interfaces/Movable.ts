export default interface Movable {
  x: number;
  y: number;

  speed: number;
  speedX: number;
  speedY: number;

  setPosition: (x: number, y: number) => void;
  setSpeed: (speed: number) => void;

  moveUp: (deltaTime: number) => void;
  moveDown: (deltaTime: number) => void;
  moveLeft: (deltaTime: number) => void;
  moveRight: (deltaTime: number) => void;

  cancelMove: (deltaTime: number) => void;
// eslint-disable-next-line semi
}
