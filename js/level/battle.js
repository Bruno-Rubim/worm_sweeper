import { timerQueue } from "../timer/timerQueue.js";
import { utils } from "../utils.js";
import { Enemy, PosionWorm, ScaleWorm, Worm } from "./enemy.js";
export class Battle {
    enemies;
    defense = 0;
    reflection = 0;
    constructor(depth, enemyCount) {
        this.enemies = [];
        let arr = [
            new Worm(depth),
            new ScaleWorm(depth),
            new PosionWorm(depth),
        ];
        let x;
        depth > 2 ? (depth > 4 ? (x = 2) : (x = 1)) : (x = 0);
        this.enemies.push(arr[Math.min(x, utils.randomArrayId(arr))]);
    }
    start(armorDefense, armorReflection) {
        this.defense = armorDefense;
        this.reflection = armorReflection;
        this.enemies.forEach((e) => {
            e.cooldownTimer.start();
            timerQueue.push(e.cooldownTimer, e.attackAnimTimer, e.damagedTimer);
        });
    }
}
