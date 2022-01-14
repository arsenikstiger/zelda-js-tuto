import DrawHelper from "../helpers/DrawHelper.js";
import GameObject from "../models/interfaces/GameObject.js";
import Rectangle from "../models/Rectangle.js";

export default class WinWindow implements GameObject {
  public text: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public buttonText: string;
  public tag: string;
  public rectangle: Rectangle;
  public buttonClicked: boolean;

  protected buttonY: number;

  public constructor(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    buttonText: string,
  ) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.buttonText = buttonText;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async initialize(): Promise<void> {
    this.buttonY = (this.height / 3) * 2;
    this.buttonClicked = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async beforeupdate(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async update(deltaTime: number, totalTime: number): Promise<void> {}

  public async draw(context: CanvasRenderingContext2D): Promise<void> {
    DrawHelper.drawRectangle(
      context,
      this.x,
      this.y,
      this.width,
      this.height,
      "white",
      0,
      "#000000DD",
      false,
      true
    );

    context.shadowColor = "white";
    context.shadowBlur = 2;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // on dessine le texte
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 1;
    context.font = "bold 32px Trebuchet MS, sans-serif";
    context.fillStyle = "white";
    context.fillText(
      this.text,
      Math.round(this.width / 2),
      Math.round(this.height / 3)
    );

    // on dessine le bouton
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 1;
    context.font = "bold 24px Trebuchet MS, sans-serif";
    context.fillStyle = "white";
    context.fillText(
      this.buttonText,
      Math.round(this.width / 2),
      Math.round(this.buttonY)
    );

    // on dessine le curseur de sélection
    DrawHelper.drawRectangle(
      context,
      Math.round(this.width / 4),
      Math.round(this.buttonY - 15),
      Math.round((this.width / 4) * 3),
      Math.round(this.buttonY + 15),
      "white",
      1,
      "black",
      true,
      false
    );
  }

  public async valid(): Promise<void> {
    this.buttonClicked = true;
  }
}
