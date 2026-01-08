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
        cooldown: 2,
    }),
    big_sword: new Weapon({
        spriteSheetPos: new Position(2, 3),
        bigSprite: sprites.big_sword_big,
        name: "big_sword",
        shopName: "Big Sword",
        cost: 50,
        damage: 3,
        cooldown: 3.2,
    }),
    dagger: new Weapon({
        spriteSheetPos: new Position(4, 3),
        bigSprite: sprites.big_sword_dagger,
        name: "dagger",
        shopName: "Dagger",
        cost: 37,
        damage: 1,
        cooldown: 1.3,
    }),
    time_blade: new TimeBlade(),
};
