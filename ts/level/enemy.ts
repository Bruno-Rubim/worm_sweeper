import type Position from "../position.js";
import { Timer } from "../timer.js";

export class Enemy {
  health: number;
  damage: number;
  pos: Position;
  cooldownTimer: Timer;
  constructor(
    health: number,
    damage: number,
    pos: Position,
    attackCooldown: number
  ) {
    this.health = health;
    this.damage = damage;
    this.pos = pos;
    this.cooldownTimer = new Timer(attackCooldown, undefined, true);
  }
}
