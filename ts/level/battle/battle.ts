import { Timer } from "../../timer/timer.js";
import { timerQueue } from "../../timer/timerQueue.js";
import { utils } from "../../utils.js";
import { Enemy, PosionWorm, ScaleWorm, Worm } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  protection: number = 0;
  defense: number = 0;
  reflection: number = 0;
  spikes: number = 0;
  stun: number = 0;

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
    initialProtection: number,
    initialDefense: number,
    initialReflection: number,
    initialSpikes: number
  ) {
    this.protection = initialProtection;
    this.defense = initialDefense;
    this.reflection = initialReflection;
    this.spikes = initialSpikes;
    this.enemies.forEach((e) => {
      e.cooldownTimer.start();
      timerQueue.push(e.cooldownTimer, e.attackAnimTimer, e.damagedTimer);
    });
  }
}
