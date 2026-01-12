import Position from "../../position.js";
import Bomb from "./bomb.js";
import { Consumable } from "./consumable.js";
import TimePotion from "./timePotion.js";
const consumableDic = {
    bomb: new Bomb(),
    health_potion_big: new Consumable({
        spriteSheetPos: new Position(2, 0),
        name: "health_potion_big",
        shopName: "Big Health Potion",
        cost: 12,
        descriptionText: "Gain 2 hearts.",
    }),
    health_potion: new Consumable({
        spriteSheetPos: new Position(4, 0),
        name: "health_potion",
        shopName: "Health Potion",
        cost: 7,
        descriptionText: "Gain 1 heart.",
    }),
    time_potion: new TimePotion(),
    empty: new Consumable({
        spriteSheetPos: new Position(14, 0),
        name: "empty",
        shopName: "",
        cost: 0,
        descriptionText: "",
    }),
};
export default consumableDic;
