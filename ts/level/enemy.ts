import { EnemyAtack } from "../action.js";
import Position from "../position.js";
import { sprites, type Sprite } from "../sprites.js";
import { Timer } from "../timer/timer.js";

export class Enemy {
  health: number;
  spikes: number;
  damage: number;
  pos: Position;
  cooldownTimer: Timer;
  attackAnimTimer: Timer;
  damagedTimer: Timer;
  spriteSheet: Sprite;
  stunSpriteShift: Position;

  constructor(args: {
    health: number;
    damage: number;
    spikes?: number;
    pos: Position;
    attackCooldown: number;
    spriteSheet: Sprite;
    stunSpriteShift?: Position;
  }) {
    this.health = args.health;
    this.damage = args.damage;
    this.spikes = args.spikes ?? 0;
    this.pos = args.pos;
    this.spriteSheet = args.spriteSheet;
    this.stunSpriteShift = args.stunSpriteShift ?? new Position();
    this.attackAnimTimer = new Timer({ goalSecs: 0.3 });
    this.damagedTimer = new Timer({ goalSecs: 0.16 });
    this.cooldownTimer = new Timer({
      goalSecs: args.attackCooldown,
      goalFunc: () => {
        return new EnemyAtack(this.damage, this);
      },
      loop: true,
    });
  }
}

export class Worm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_worm,
      health: 3 + Math.floor(depth / 5),
      damage: 1 + Math.floor((depth / 7) * 2) / 2,
      attackCooldown: 5 - depth * 0.15,
    });
  }
}

export class ScaleWorm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_scale_worm,
      health: 6 + Math.floor((depth / 3) * 2) / 2,
      damage: 2 + Math.floor(depth / 5),
      attackCooldown: 8 - Math.floor(depth / 3) * 0.5,
      stunSpriteShift: new Position(8, 21),
    });
  }
}

export class PosionWorm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_poison_worm,
      health: 3 + Math.floor(depth / 4),
      damage: Math.max(0, 0 + Math.floor(((depth - 5) / 3) * 2) / 2),
      attackCooldown: 4 - depth * 0.1,
      spikes: 0.5,
    });
    this.cooldownTimer.goalFunc = () => {
      this.spikes += 0.5;
      return new EnemyAtack(this.damage, this);
    };
  }
}
