import playerInventory from "../../inventory/playerInventory.js";
import { utils } from "../../utils.js";
import { Enemy, PosionWorm, ScaleWorm, Worm } from "./enemy.js";
export class Battle {
    enemies;
    protection = 0;
    defense = 0;
    reflection = 0;
    spikes = 0;
    stun = 0;
    chest;
    won = false;
    constructor(depth, enemyCount, chest) {
        this.enemies = [];
        this.chest = chest;
        if (this.chest) {
            depth += 2;
        }
        let arr = [
            new Worm(depth),
            new ScaleWorm(depth),
            new PosionWorm(depth),
        ];
        let x;
        depth > 2 ? (depth > 4 ? (x = 2) : (x = 1)) : (x = 0);
        this.enemies.push(arr[Math.min(x, utils.randomArrayId(arr))]);
    }
    start() {
        const helmet = playerInventory.hasItem("safety_helmet");
        const glassArmor = playerInventory.hasItem("glass_armor");
        this.protection = playerInventory.armor.item.protection;
        this.defense =
            playerInventory.armor.item.defense +
                (helmet ? (glassArmor ? 0.5 : 1) : 0);
        this.reflection =
            playerInventory.armor.item.reflection + (helmet && glassArmor ? 0.5 : 0);
        this.spikes = playerInventory.armor.item.spikes;
        this.enemies.forEach((e) => {
            e.cooldownTimer.start();
        });
    }
}
