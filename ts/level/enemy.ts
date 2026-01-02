import { EnemyAtack } from "../action.js";
import Position from "../position.js";
import { Timer } from "../timer/timer.js";

export class Enemy {
  health: number;
  damage: number;
  pos: Position;
  cooldownTimer: Timer;
  attackAnimTimer: Timer;
  damagedTimer: Timer;
  constructor(
    health: number,
    damage: number,
    pos: Position,
    attackCooldown: number
  ) {
    this.health = health;
    this.damage = damage;
    this.pos = pos;
    this.attackAnimTimer = new Timer(0.5);
    this.damagedTimer = new Timer(0.3);
    this.cooldownTimer = new Timer(
      attackCooldown,
      () => {
        return new EnemyAtack(this.damage, this);
      },
      true
    );
  }
}

export class Worm extends Enemy {
  constructor(depth: number) {
    super(
      3 + Math.floor(depth / 3),
      1 + Math.floor(depth / 5),
      new Position(56, 36),
      5 - (Math.floor(depth / 2) * 50) / 1000
    );
  }
}
