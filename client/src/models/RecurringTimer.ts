export default class RecurringTimer {
  public startedAt: number;
  public frequencyMilliseconds: number;
  public hasElapsed: boolean;

  public constructor(frequencyMilliseconds: number) {
    this.startedAt = 0;
    this.frequencyMilliseconds = frequencyMilliseconds;
    this.hasElapsed = false;
  }

  public async update(deltaTime: number, totalTime: number): Promise<void> {
    if (totalTime - this.startedAt > this.frequencyMilliseconds) {
      this.startedAt = totalTime;
      this.hasElapsed = true;
    } else {
      this.hasElapsed = false;
    }
  }
}
