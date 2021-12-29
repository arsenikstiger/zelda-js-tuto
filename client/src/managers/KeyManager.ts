export default class KeyManager {
  public pressedKeys: {
    left: false;
    right: false;
    up: false;
    down: false;
    space: false;
  };

  public keyMap = {
    39: "right",
    37: "left",
    38: "up",
    40: "down",
    32: "space",
  };

  initialize() {
    window.addEventListener("keydown", this.keydown, false);
    window.addEventListener("keyup", this.keyup, false);
  }

  public keydown(event: KeyboardEvent): void {
    const key = this.keyMap[event.keyCode];
    this.pressedKeys[key] = true;
  }

  public keyup(event: KeyboardEvent): void {
    const key = this.keyMap[event.keyCode];
    this.pressedKeys[key] = false;
  }
}
