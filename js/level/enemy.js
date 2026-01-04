import { EnemyAtack } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import { Timer } from "../timer/timer.js";
export class Enemy {
    health;
    damage;
    pos;
    cooldownTimer;
    attackAnimTimer;
    damagedTimer;
    spriteSheet;
    constructor(args) {
        this.health = args.health;
        this.damage = args.damage;
        this.pos = args.pos;
        this.spriteSheet = args.spriteSheet;
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
    constructor(depth) {
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
    constructor(depth) {
        super({
            pos: new Position(56, 36),
            spriteSheet: sprites.enemy_scale_worm,
            health: 6 + Math.floor(depth / 3),
            damage: 2 + Math.floor(depth / 5),
            attackCooldown: 8 - Math.floor(depth / 3) * 0.5,
        });
    }
}
