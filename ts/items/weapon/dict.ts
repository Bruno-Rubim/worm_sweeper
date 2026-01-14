import { ActionBar } from "../actionBar.js";
import Position from "../../position.js";
import { sprites } from "../../sprites.js";
import TimeBlade from "./timeBlade.js";
import { Weapon } from "./weapon.js";

export const weaponDic = {
  wood_sword: new Weapon({
    spriteSheetPos: new Position(0, 3),
    bigSprite: sprites.big_sword_wood,
    name: "wood_sword",
    shopName: "",
    cost: 0,
    damage: 1,
    cooldown: 2.5,
    actionHighlights: [
      { startPerc: 30, widthPerc: 20, type: "damage", value: 1 },
      { startPerc: 80, widthPerc: 3, type: "damage", value: 1 },
    ],
  }),
  big_sword: new Weapon({
    spriteSheetPos: new Position(2, 3),
    bigSprite: sprites.big_sword_big,
    name: "big_sword",
    shopName: "Big Sword",
    cost: 50,
    damage: 3,
    cooldown: 3.2,
    actionHighlights: [
      { startPerc: 20, widthPerc: 15, type: "damage", value: 1 },
      { startPerc: 50, widthPerc: 15, type: "damage", value: 1 },
      { startPerc: 80, widthPerc: 15, type: "damage", value: 1 },
    ],
  }),
  dagger: new Weapon({
    spriteSheetPos: new Position(4, 3),
    bigSprite: sprites.big_sword_dagger,
    name: "dagger",
    shopName: "Dagger",
    cost: 37,
    damage: 1,
    cooldown: 1.3,
    actionHighlights: [
      { startPerc: 15, widthPerc: 3, type: "damage", value: 1 },
      { startPerc: 80, widthPerc: 10, type: "damage", value: 1 },
    ],
  }),
  cactus: new Weapon({
    spriteSheetPos: new Position(10, 3),
    bigSprite: sprites.big_sword_cactus,
    name: "cactus",
    shopName: "Cactus",
    cost: 19,
    damage: 0.5,
    spikes: 1,
    cooldown: 1,
    actionHighlights: [
      { startPerc: 30, widthPerc: 10, type: "damage", value: 0.5 },
    ],
  }),
  time_blade: new TimeBlade(),
};
