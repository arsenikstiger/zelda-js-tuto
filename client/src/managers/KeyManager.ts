export default class KeyManager {
  public left: boolean;
  public right: boolean;
  public up: boolean;
  public down: boolean;
  public space: boolean;

  public static keyMap: Record<number, string> = {
    39: "right",
    37: "left",
    38: "up",
    40: "down",
    32: "space",
  };

  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.space = false;
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
