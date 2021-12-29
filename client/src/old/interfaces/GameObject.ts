export default class GameObject {
  public tag: string;

  constructor(tag: string = "") {
    this.tag = tag;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public initialize(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public update(deltaTime: number, totalTime: number): void {}
}