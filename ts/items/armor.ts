import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Armor extends Item {
  defense: number;
  speed: number;
  reflection: number;

  constructor(
    spriteSheetPos: Position,
    name: string,
    defense: number,
    delay?: number,
    reflection?: 0
  ) {
    super(new Position(GAMEWIDTH - 20, 54), spriteSheetPos, name);
    this.defense = defense;
    this.speed = delay ?? 0;
    this.reflection = reflection ?? 0;
    this.description =
      (this.defense > 0 ? "$dfsDefense: " + this.defense + "\n" : "") +
      (this.reflection > 0 ? "$rfcDefense: " + this.reflection + "\n" : "") +
      (this.speed < 0 ? "$slwSlowness: " + Math.abs(this.speed) + "s\n" : "") +
      (this.speed > 0 ? "$spdAgility: " + this.speed + "s\n" : "");
    this.descFontSize = 0.6;
  }
}

export const armorDic = {
  chainmail: new Armor(new Position(0, 2), "chainmail", 2, -0.2),
  swift_vest: new Armor(new Position(2, 2), "swift_vest", 0, 0.2),
  empty: new Armor(new Position(14, 2), "empty", 0),
};
