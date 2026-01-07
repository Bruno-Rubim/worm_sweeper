import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Armor extends Item {
  defense: number;
  speed: number;
  reflection: number;

  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    defense?: number;
    speed?: number;
    reflection?: 0;
  }) {
    args.defense = args.defense ?? 0;
    args.reflection = args.reflection ?? 0;
    args.speed = args.speed ?? 0;
    super({
      ...args,
      pos: new Position(GAMEWIDTH - 20, 54),
      description:
        (args.defense > 0 ? "$dfsDefense: " + args.defense + "\n" : "") +
        (args.reflection ?? 0 > 0
          ? "$refDefense: " + args.reflection + "\n"
          : "") +
        (args.speed < 0
          ? "$slwSlowness: " + Math.abs(args.speed) + "s\n"
          : "") +
        (args.speed > 0 ? "$spdAgility: " + args.speed + "s\n" : ""),
    });
    this.defense = args.defense;
    this.speed = args.speed ?? 0;
    this.reflection = args.reflection ?? 0;
    this.description =
      (this.defense > 0 ? "$dfsDefense: " + this.defense + "\n" : "") +
      (this.reflection > 0 ? "$refDefense: " + this.reflection + "\n" : "") +
      (this.speed < 0 ? "$slwSlowness: " + Math.abs(this.speed) + "s\n" : "") +
      (this.speed > 0 ? "$spdAgility: " + this.speed + "s\n" : "");
    this.descFontSize = 0.6;
  }
}

export const armorDic = {
  chainmail: new Armor({
    spriteSheetPos: new Position(0, 2),
    name: "chainmail",
    shopName: "Chainmail",
    cost: 40,
    defense: 2,
    speed: -1,
  }),
  swift_vest: new Armor({
    spriteSheetPos: new Position(2, 2),
    name: "swift_vest",
    shopName: "Swift Vest",
    cost: 38,
    defense: 0,
    speed: 0.3,
  }),
  empty: new Armor({
    spriteSheetPos: new Position(14, 2),
    name: "empty",
    shopName: "empty",
    cost: 0,
    defense: 0,
  }),
};
