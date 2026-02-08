import playerInventory from "../../inventory/playerInventory.js";
import { utils } from "../../utils.js";
import { Enemy, PosionWorm, RibbonWorm, ScaleWorm, Worm } from "./enemy.js";

export class Battle {
  enemies: Enemy[];
  protection: number = 0;
  defense: number = 0;
  reflection: number = 0;
  spikes: number = 0;
  stun: number = 0;
  chest: boolean;
  won: boolean = false;

  constructor(depth: number, enemyCount: number, chest: boolean) {
    this.enemies = [];
    this.chest = chest;
    if (this.chest) {
      depth = 2 + depth * 1.15;
    }

    let arr: Enemy[] = [
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
    const enemy = arr[utils.randomArrayId(arr)]!;

    if (playerInventory.hasItem("moon_flower")) {
      enemy.cooldownTimer.goalSecs *= 1.2;
    }

    if (playerInventory.hasItem("fang_necklace")) {
      enemy.damage = Math.ceil(enemy.damage) / 2;
      enemy.cooldownTimer.goalSecs *= 0.7;
    }

    this.enemies.push(enemy);
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
