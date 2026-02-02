import Position from "../../gameElements/position.js";
import { soundManager } from "../../sounds/soundManager.js";
import sounds from "../../sounds/sounds.js";
import { sprites } from "../../sprites.js";
import { ActiveItem, TimedActiveItem } from "./active.js";

const activeDict = {
  silver_bell: new TimedActiveItem({
    spriteSheetPos: new Position(2, 0),
    altSpriteSheet: sprites.bell_shine_sheet,
    name: "silver_bell",
    cost: 15,
    shopName: "Silver Bell",
    descriptionText:
      "Reveals the location of doors, or stuns enemies if used during battle. Recharges outside of shop after 60 seconds.",
    cooldown: 5,
  }),
  radar: new TimedActiveItem({
    spriteSheetPos: new Position(6, 0),
    altSpriteSheet: sprites.radar_sheet,
    name: "radar",
    cost: 40,
    shopName: "Radar",
    descriptionText:
      "Reveals worms around it. Recharges outside of shop after 45 seconds.",
    cooldown: 5,
    goalFunc: () => {
      soundManager.playSound(sounds.radar_ready);
    },
  }),

  empty: new ActiveItem({
    spriteSheetPos: new Position(14, 0),
    name: "empty",
    shopName: "",
    cost: 0,
  }),
  locked: new ActiveItem({
    spriteSheetPos: new Position(-1, -1),
    name: "locked",
    shopName: "",
    cost: 0,
  }),
};

export default activeDict;
