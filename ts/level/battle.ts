import { timerQueue } from "../timer/timerQueue.js";
import { utils } from "../utils.js";
import { Enemy, ScaleWorm, Worm } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  defense: number = 0;
  reflection: number = 0;

  constructor(depth: number, enemyCount: number) {
    this.enemies = [];
    let arr: Enemy[] = [new Worm(depth), new ScaleWorm(depth)];
    let x = depth > 2 ? 1 : 0;
    this.enemies.push(arr[Math.min(x, utils.randomArrayId(arr))]!);
  }
  start() {
    this.enemies.forEach((e) => {
      e.cooldownTimer.start();
      timerQueue.push(e.cooldownTimer, e.attackAnimTimer, e.damagedTimer);
    });
  }
}
