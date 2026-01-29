import playerInventory, {
  getRandomItem,
  hasItem,
} from "../../inventory/playerInventory.js";
import type { Item } from "../../items/item.js";
import { utils } from "../../utils.js";
import { Enemy, PosionWorm, ScaleWorm, Worm } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  protection: number = 0;
  defense: number = 0;
  reflection: number = 0;
  spikes: number = 0;
  stun: number = 0;
  chest: boolean;
  item: Item | null = getRandomItem();
  won: boolean = false;

  constructor(depth: number, enemyCount: number, chest: boolean) {
    this.enemies = [];
    let arr: Enemy[] = [
      new Worm(depth),
      new ScaleWorm(depth),
      new PosionWorm(depth),
    ];
    let x;
    depth > 2 ? (depth > 4 ? (x = 2) : (x = 1)) : (x = 0);

    this.enemies.push(arr[Math.min(x, utils.randomArrayId(arr))]!);
    this.chest = chest;
  }
  start() {
    const helmet = hasItem("safety_helmet");
    const glassArmor = hasItem("glass_armor");
    this.protection = playerInventory.armor.protection;
    this.defense =
      playerInventory.armor.defense + (helmet ? (glassArmor ? 0.5 : 1) : 0);
    this.reflection =
      playerInventory.armor.reflection + (helmet && glassArmor ? 0.5 : 0);
    this.spikes = playerInventory.armor.spikes;
    this.enemies.forEach((e) => {
      e.cooldownTimer.start();
    });
  }
}
