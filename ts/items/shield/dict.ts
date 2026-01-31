import Position from "../../gameElements/position.js";
import { sprites } from "../../sprites.js";
import ScaleShield from "./scaleShield.js";
import { Shield } from "./shield.js";

export const shieldDict = {
  wood_shield: new Shield({
    spriteSheetPos: new Position(0, 1),
    bigSprite: sprites.big_shield_wood,
    name: "wood_shield",
    shopName: "",
    cost: 0,
    defense: 1,
    cooldown: 2.5,
  }),
  jade_shield: new Shield({
    spriteSheetPos: new Position(2, 1),
    bigSprite: sprites.big_shield_jade,
    name: "jade_shield",
    shopName: "Jade Shield",
    cost: 19,
    cooldown: 2,
    reflection: 1,
  }),
  steel_shield: new Shield({
    spriteSheetPos: new Position(4, 1),
    bigSprite: sprites.big_shield_steel,
    name: "steel_shield",
    shopName: "Steel Shield",
    cost: 20,
    defense: 2,
    cooldown: 3,
  }),
  hand_shield: new Shield({
    spriteSheetPos: new Position(6, 1),
    bigSprite: sprites.big_shield_hand,
    name: "hand_shield",
    shopName: "Hand Shield",
    cost: 23,
    defense: 0.5,
    cooldown: 1.2,
  }),
  claw_shield: new Shield({
    spriteSheetPos: new Position(8, 1),
    bigSprite: sprites.big_shield_claw,
    name: "claw_shield",
    shopName: "Claw Shield",
    cost: 28,
    defense: 1,
    spikes: 1.5,
    cooldown: 2.3,
  }),
  scale_shield: new ScaleShield(),
};
