import playerInventory from "../../inventory/playerInventory.js";
import { utils } from "../../utils.js";
import { Enemy, PosionWorm, RibbonWorm, ScaleWorm, Worm } from "./enemy.js";
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
            depth = 2 + depth * 1.15;
        }
        let arr = [
            new Worm(depth),
            new ScaleWorm(depth),
            new PosionWorm(depth),
            new RibbonWorm(depth),
        ];
        let x;
        depth > 2
            ? depth > 5
                ? depth > 10
                    ? (x = 4)
                    : (x = 3)
                : (x = 2)
            : (x = 1);
        arr = arr.slice(0, x);
        this.enemies.push(arr[utils.randomArrayId(arr)]);
    }
    start() {
        const helmet = playerInventory.hasItem("safety_helmet");
        const glassArmor = playerInventory.armor.item.name == "glass_armor";
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
