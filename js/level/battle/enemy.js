import { EnemyAtack } from "../../action.js";
import Position from "../../gameElements/position.js";
import { sounds } from "../../sounds.js";
import { sprites } from "../../sprites.js";
import { Timer } from "../../timer/timer.js";
import timeTracker from "../../timer/timeTracker.js";
export class Enemy {
    health;
    spikes;
    damage;
    pos;
    cooldownTimer;
    attackAnimTimer;
    damagedTimer;
    spriteSheet;
    stunSpriteShift;
    biteSound;
    stunTimer = new Timer({});
    stunTicStart = null;
    constructor(args) {
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
            goalSecs: args.attackCooldown,
            goalFunc: () => {
                return new EnemyAtack(this.damage, this);
            },
            loop: true,
            autoStart: false,
        });
    }
    stun(seconds) {
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
    constructor(depth) {
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
    constructor(depth) {
        super({
            pos: new Position(56, 36),
            spriteSheet: sprites.enemy_scale_worm,
            health: 6 + Math.floor(depth / 3),
            damage: 2 + Math.floor((depth / 8) * 2) / 2,
            attackCooldown: 8 - Math.floor(depth / 3) * 0.3,
            stunSpriteShift: new Position(8, 21),
        });
    }
}
export class PosionWorm extends Enemy {
    constructor(depth) {
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
            return new EnemyAtack(this.damage, this);
        };
    }
}
