import Position from "../../gameElements/position.js";
import { Consumable } from "./consumable.js";
import TimePotion from "./timePotion.js";

const consumableDict = {
  health_potion_big: new Consumable({
    spriteSheetPos: new Position(0, 6),
    name: "health_potion_big",
    shopName: "Big Health Potion",
    cost: 12,
    descriptionText: "Gain 2 hearts.",
  }),
  health_potion: new Consumable({
    spriteSheetPos: new Position(2, 6),
    name: "health_potion",
    shopName: "Health Potion",
    cost: 7,
    descriptionText: "Gain 1 heart.",
  }),
  time_potion: new TimePotion(),
};

export default consumableDict;
