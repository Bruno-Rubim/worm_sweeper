import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Armor extends Item {
  constructor(spriteSheetPos: Position, name: string) {
    super(new Position(GAMEWIDTH - 20, 54), spriteSheetPos, name);
  }
}

export const armorList = {
  chainmail: new Armor(new Position(0, 2), "chainmail"),
  swift_vest: new Armor(new Position(2, 2), "swift_vest"),
  empty: new Armor(new Position(14, 2), "empty"),
};
