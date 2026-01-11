import { GAMEWIDTH } from "../../global.js";
import Position from "../../position.js";
import { Item } from "../item.js";

export class Armor extends Item {
  defense: number;
  speedMult: number;
  reflection: number;
  spikes: number;

  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    defense?: number;
    speedMult?: number;
    reflection?: number;
    spikes?: number;
  }) {
    args.defense = args.defense ?? 0;
    args.reflection = args.reflection ?? 0;
    args.speedMult = args.speedMult ?? 1;
    super({
      ...args,
      pos: new Position(GAMEWIDTH - 20, 54),
      descriptionText:
        (args.defense > 0 ? "$dfsDefense: " + args.defense + "\n" : "") +
        (args.reflection ?? 0 > 0
          ? "$refDefense: " + args.reflection + "\n"
          : "") +
        (args.speedMult > 1
          ? "$slwSpeed: +" +
            Math.abs(Math.floor((1 - args.speedMult) * 100)) +
            "%"
          : "") +
        (args.speedMult < 1 && args.speedMult
          ? "$spdSpeed: -" + Math.floor((1 - args.speedMult) * 100) + "%"
          : ""),
    });
    this.descFontSize = 0.6;
    this.defense = args.defense;
    this.speedMult = args.speedMult;
    this.reflection = args.reflection;
    this.spikes = args.spikes ?? 0;
  }
}

export const armorDic = {
  chainmail: new Armor({
    spriteSheetPos: new Position(0, 2),
    name: "chainmail",
    shopName: "Chainmail",
    cost: 22,
    defense: 1,
    speedMult: 1.5,
  }),
  swift_vest: new Armor({
    spriteSheetPos: new Position(2, 2),
    name: "swift_vest",
    shopName: "Swift Vest",
    cost: 38,
    defense: 0,
    speedMult: 0.7,
  }),
  silver_chestplate: new Armor({
    spriteSheetPos: new Position(4, 2),
    name: "silver_chestplate",
    shopName: "Silver Chestplate",
    cost: 72,
    defense: 5,
    speedMult: 1.5,
  }),
  empty: new Armor({
    spriteSheetPos: new Position(14, 2),
    name: "empty",
    shopName: "empty",
    cost: 0,
    defense: 0,
  }),
};
