import { timerQueue } from "../timer/timerQueue.js";
import { utils } from "../utils.js";
import { Enemy, PosionWorm, ScaleWorm, Worm } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  defense: number = 0;
  reflection: number = 0;
  spikes: number = 0;

  constructor(depth: number, enemyCount: number) {
    this.enemies = [];
    let arr: Enemy[] = [
      new Worm(depth),
      new ScaleWorm(depth),
      new PosionWorm(depth),
    ];
    let x;
    depth > 2 ? (depth > 4 ? (x = 2) : (x = 1)) : (x = 0);

    this.enemies.push(arr[Math.min(x, utils.randomArrayId(arr))]!);
  }
  start(
    initialDefense: number,
    initialReflection: number,
    initialSpikes: number
  ) {
    this.defense = initialDefense;
    this.reflection = initialReflection;
    this.spikes = initialSpikes;
    this.enemies.forEach((e) => {
      e.cooldownTimer.start();
      timerQueue.push(e.cooldownTimer, e.attackAnimTimer, e.damagedTimer);
    });
  }
}
