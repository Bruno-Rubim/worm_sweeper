import Position from "../../gameElements/position.js";
import { ActiveItem } from "./active.js";
import { SilverBell } from "./silverBell.js";

const activeDict = {
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
    descriptionText: "Reset your current cooldown instantly.",
  }),
  silver_bell: new SilverBell(),
  empty: new ActiveItem({
    spriteSheetPos: new Position(14, 0),
    name: "empty",
    shopName: "",
    cost: 0,
    descriptionText: "",
  }),
  altEmpty: new ActiveItem({
    spriteSheetPos: new Position(14, 1),
    name: "alt_empty",
    shopName: "",
    cost: 0,
    descriptionText: "",
  }),
};

export default activeDict;
