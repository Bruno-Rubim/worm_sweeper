import { timerQueue } from "../timer/timerQueue.js";
import { Enemy, Worm } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  constructor(depth: number) {
    this.enemies = [new Worm(depth)];
    this.enemies.forEach((e) => {
      e.cooldownTimer.start();
      timerQueue.push(e.cooldownTimer, e.attackAnimTimer, e.damagedTimer);
    });
  }
}
