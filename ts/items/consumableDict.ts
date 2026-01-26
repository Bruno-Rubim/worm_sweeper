import { InstantItem } from "./instant/instantItem.js";
import Position from "../gameElements/position.js";
import TimePotion from "./instant/timePotion.js";
import { ActiveItem } from "./active/active.js";

const consumableDict = {
  health_potion_big: new InstantItem({
    spriteSheetPos: new Position(0, 6),
    name: "health_potion_big",
    shopName: "Big Health Potion",
    cost: 12,
    descriptionText: "Gain 2 hearts.",
  }),
  health_potion: new InstantItem({
    spriteSheetPos: new Position(2, 6),
    name: "health_potion",
    shopName: "Health Potion",
    cost: 7,
    descriptionText: "Gain 1 heart.",
  }),
  bomb: new ActiveItem({
    spriteSheetPos: new Position(0, 0),
    name: "bomb",
    shopName: "Bomb",
    cost: 6,
    descriptionText:
      "Deal 5 damage during battle or use on any block to destroy blocks around it, along with worms and gold.",
  }),
  energy_potion: new ActiveItem({
    spriteSheetPos: new Position(4, 0),
    name: "energy_potion",
    shopName: "Energy Potion",
    cost: 5,
    descriptionText: "Reset your $spdcooldown in a battle instantly.",
  }),
  time_potion: new TimePotion(),
};

export default consumableDict;
