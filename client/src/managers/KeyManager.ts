export default class KeyManager {
  public enter: boolean;
  public space: boolean;
  public left: boolean;
  public up: boolean;
  public right: boolean;
  public down: boolean;

  public static keyMap: Record<number, string> = {
    13: "enter",
    32: "space",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  constructor() {
    this.enter = false;
    this.space = false;
    this.left = false;
    this.up = false;
    this.right = false;
    this.down = false;
  }

  public async initialize(): Promise<void> {
    window.addEventListener(
      "keydown",
      (event) => KeyManager.keydown(event, this),
      false
    );
    window.addEventListener(
      "keyup",
      (event) => KeyManager.keyup(event, this),
      false
    );
  }

  private static keydown(event: KeyboardEvent, keyManager: KeyManager): void {
    const key = KeyManager.keyMap[event.keyCode];
    keyManager[key] = true;
  }

  private static keyup(event: KeyboardEvent, keyManager: KeyManager): void {
    const key = KeyManager.keyMap[event.keyCode];
    keyManager[key] = false;
  }
}
