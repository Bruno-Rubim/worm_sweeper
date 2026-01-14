import type { ActionBar } from "../../items/actionBar.js";
import { utils } from "../../utils.js";
import { Enemy, PosionWorm, ScaleWorm, TestingWorm, Worm } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  protection: number = 0;
  defense: number = 0;
  reflection: number = 0;
  spikes: number = 0;
  actionBar: null | ActionBar = null;

  constructor(depth: number, enemyCount: number) {
    this.enemies = [];
    let arr: Enemy[] = [
      new Worm(depth),
      new ScaleWorm(depth),
      new PosionWorm(depth),
    ];
    let x;
    depth > 2 ? (depth > 4 ? (x = 2) : (x = 1)) : (x = 0);
    if (depth == -1) {
      this.enemies = [new TestingWorm(0)];
      return;
    }

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
    });
  }
}
