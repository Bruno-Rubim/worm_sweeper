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
  constructor(args: {
    health: number;
    damage: number;
    pos: Position;
    attackCooldown: number;
    spriteSheet: Sprite;
  }) {
    this.health = args.health;
    this.damage = args.damage;
    this.pos = args.pos;
    this.spriteSheet = args.spriteSheet;
    this.attackAnimTimer = new Timer(0.3);
    this.damagedTimer = new Timer(0.16);
    this.cooldownTimer = new Timer(
      args.attackCooldown,
      () => {
        return new EnemyAtack(this.damage, this);
      },
      true
    );
  }
}

export class Worm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_worm,
      health: 3 + Math.floor(depth / 3),
      damage: 1 + Math.floor(depth / 7),
      attackCooldown: 5 - depth * 0.1,
    });
  }
}

export class ScaleWorm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_scale_worm,
      health: 6 + Math.floor(depth / 3),
      damage: 2 + Math.floor(depth / 5),
      attackCooldown: 8 - Math.floor(depth / 3) * 0.5,
    });
  }
}
