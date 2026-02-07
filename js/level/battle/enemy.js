import { EnemyAttack } from "../../action.js";
import Position from "../../gameElements/position.js";
import playerInventory from "../../inventory/playerInventory.js";
import { sounds } from "../../sounds/sounds.js";
import { sprites } from "../../sprites.js";
import { Timer } from "../../timer/timer.js";
import timeTracker from "../../timer/timeTracker.js";
export class Enemy {
    health;
    spikes;
    stun;
    damage;
    defense;
    level;
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
        this.health = 0;
        this.damage = 0;
        this.defense = 0;
        this.spikes = 0;
        this.stun = 0;
        this.level = args.level;
        this.pos = args.pos;
        this.biteSound = args.biteSound ?? sounds.bite;
        this.spriteSheet = args.spriteSheet;
        this.stunSpriteShift = args.stunSpriteShift ?? new Position();
        this.attackAnimTimer = new Timer({ goalSecs: 0.3, autoStart: false });
        this.damagedTimer = new Timer({ goalSecs: 0.16, autoStart: false });
        this.cooldownTimer = new Timer({
            goalSecs: args.attackCooldown *
                (playerInventory.hasItem("moon_flower") ? 1.2 : 1),
            goalFunc: () => {
                return new EnemyAttack(this);
            },
            loop: true,
            autoStart: false,
        });
    }
    stunned(seconds) {
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
    takeDamage(damage) {
        if (damage <= 0) {
            return 0;
        }
        let returnDamage = this.spikes;
        this.spikes = 0;
        const defense = this.defense;
        this.defense = Math.max(0, defense - damage);
        damage = Math.max(0, damage - defense);
        if (damage > 0) {
            this.health -= damage;
            this.damagedTimer.start();
        }
        return returnDamage;
    }
}
export class Worm extends Enemy {
    constructor(depth) {
        super({
            level: depth,
            attackCooldown: 5 - depth * 0.12,
            pos: new Position(56, 36),
            spriteSheet: sprites.enemy_worm,
        });
        this.health = 3 + Math.floor(this.level / 6);
        this.damage = 1 + Math.floor((this.level / 30) * 2) / 2;
    }
}
export class ScaleWorm extends Enemy {
    constructor(depth) {
        super({
            level: depth,
            pos: new Position(56, 36),
            spriteSheet: sprites.enemy_scale_worm,
            attackCooldown: 8 - Math.floor(depth / 3) * 0.3,
            stunSpriteShift: new Position(8, 21),
        });
        this.health = 6 + Math.floor(depth / 3);
        this.damage = 1.5 + Math.floor((depth / 8) * 2) / 2;
    }
}
export class PosionWorm extends Enemy {
    constructor(depth) {
        super({
            level: depth,
            attackCooldown: 6,
            pos: new Position(56, 36),
            spriteSheet: sprites.enemy_poison_worm,
        });
        this.damage = Math.max(0, 0.5 + Math.floor((this.level - 5) / 4) / 2);
        this.health = 3 + Math.floor(this.level / 5);
        this.spikes = Math.max(0, 0.5 + Math.floor((this.level - 5) / 4) / 2);
        this.cooldownTimer.goalFunc = () => {
            this.spikes += this.damage;
            console.log(this.spikes);
            return new EnemyAttack(this);
        };
    }
}
export class RibbonWorm extends Enemy {
    constructor(depth) {
        super({
            level: depth,
            attackCooldown: 5 - depth * 0.1,
            pos: new Position(56, 36),
            spriteSheet: sprites.enemy_ribbon_worm,
            stunSpriteShift: new Position(0, 0),
        });
        this.damage = -0.5 + Math.floor((this.level / 10) * 2) / 2;
        this.health = 3 + Math.floor(this.level / 4);
        this.stun = this.damage;
        this.cooldownTimer.goalFunc = () => {
            return new EnemyAttack(this);
        };
    }
}
