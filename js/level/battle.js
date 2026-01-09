import { timerQueue } from "../timer/timerQueue.js";
import { utils } from "../utils.js";
import { Enemy, ScaleWorm, Worm } from "./enemy.js";
export class Battle {
    enemies;
    defense = 0;
    reflection = 0;
    constructor(depth, enemyCount) {
        this.enemies = [];
        let arr = [new Worm(depth), new ScaleWorm(depth)];
        let x = depth > 2 ? 1 : 0;
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
