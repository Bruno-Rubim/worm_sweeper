import { EnemyAtack } from "../action.js";
import Position from "../position.js";
import { sprites, type Sprite } from "../sprite.js";
import { Timer } from "../timer/timer.js";

export class Enemy {
  health: number;
  damage: number;
  pos: Position;
  cooldownTimer: Timer;
  attackAnimTimer: Timer;
  damagedTimer: Timer;
  spriteSheet: Sprite;
  constructor(
    health: number,
    damage: number,
    pos: Position,
    attackCooldown: number,
    spriteSheet: Sprite
  ) {
    this.health = health;
    this.damage = damage;
    this.pos = pos;
    this.spriteSheet = spriteSheet;
    this.attackAnimTimer = new Timer(0.3);
    this.damagedTimer = new Timer(0.16);
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
      5 - (Math.floor(depth / 2) * 50) / 1000,
      sprites.enemy_worm
    );
  }
}

export class ScaleWorm extends Enemy {
  constructor(depth: number) {
    super(
      6 + Math.floor(depth / 3),
      2 + Math.floor(depth / 5),
      new Position(56, 36),
      8 - (Math.floor(depth / 3) * 20) / 1000,
      sprites.enemy_scale_worm
    );
  }
}
