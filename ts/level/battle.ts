import Position from "../position.js";
import { timerQueue } from "../timer/timerQueue.js";
import { Enemy } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  constructor() {
    this.enemies = [new Enemy(3, 1, new Position(56, 36), 5)];
    this.enemies.forEach((e) => {
      e.cooldownTimer.start();
      timerQueue.push(e.cooldownTimer);
    });
  }
}
