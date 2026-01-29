import { EnemyAttack } from "../../action.js";
import Position from "../../gameElements/position.js";
import { hasItem } from "../../inventory/playerInventory.js";
import { sounds, type Sound } from "../../sounds/sounds.js";
import { sprites, type Sprite } from "../../sprites.js";
import { Timer } from "../../timer/timer.js";
import timeTracker from "../../timer/timeTracker.js";

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
  biteSound: Sound;
  stunTimer: Timer = new Timer({});
  stunTicStart: number | null = null;

  constructor(args: {
    health: number;
    damage: number;
    spikes?: number;
    pos: Position;
    attackCooldown: number;
    spriteSheet: Sprite;
    stunSpriteShift?: Position;
    biteSound?: Sound;
  }) {
    this.health = args.health;
    this.damage = args.damage;
    this.spikes = args.spikes ?? 0;
    this.pos = args.pos;
    this.biteSound = args.biteSound ?? sounds.bite;
    this.spriteSheet = args.spriteSheet;
    this.stunSpriteShift = args.stunSpriteShift ?? new Position();
    this.attackAnimTimer = new Timer({ goalSecs: 0.3, autoStart: false });
    this.damagedTimer = new Timer({ goalSecs: 0.16, autoStart: false });
    this.cooldownTimer = new Timer({
      goalSecs: args.attackCooldown * (hasItem("moon_flower") ? 1.2 : 1),
      goalFunc: () => {
        return new EnemyAttack(this.damage, this);
      },
      loop: true,
      autoStart: false,
    });
  }

  stun(seconds: number) {
    this.stunTimer = new Timer({
      goalSecs: seconds,
      goalFunc: () => {
        this.cooldownTimer.unpause();
        this.stunTicStart = null;
      },
    });
    this.stunTimer.start();
    this.cooldownTimer.pause();
    this.stunTicStart = timeTracker.currentGameTic;
  }

  die() {
    this.cooldownTimer.pause();
    this.stunTimer.pause();
    this.damagedTimer.pause();
    this.attackAnimTimer.pause();
  }
}

export class Worm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_worm,
      health: 3 + Math.floor(depth / 6),
      damage: 1 + Math.floor((depth / 30) * 2) / 2,
      attackCooldown: 5 - depth * 0.12,
    });
  }
}

export class ScaleWorm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_scale_worm,
      health: 6 + Math.floor(depth / 3),
      damage: 1.5 + Math.floor((depth / 8) * 2) / 2,
      attackCooldown: 8 - Math.floor(depth / 3) * 0.3,
      stunSpriteShift: new Position(8, 21),
    });
  }
}

export class PosionWorm extends Enemy {
  constructor(depth: number) {
    super({
      pos: new Position(56, 36),
      spriteSheet: sprites.enemy_poison_worm,
      health: 3 + Math.floor(depth / 5),
      damage: Math.max(0, 0.5 + Math.floor((depth - 5) / 4) / 2),
      attackCooldown: 6,
      spikes: Math.max(0, 0.5 + Math.floor((depth - 5) / 4) / 2),
    });
    this.cooldownTimer.goalFunc = () => {
      this.spikes += this.damage;
      return new EnemyAttack(this.damage, this);
    };
  }
}
