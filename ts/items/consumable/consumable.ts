import { GAMEWIDTH, LEFT, type cursorClick } from "../../global.js";
import { ConsumeItem, SellItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { Item } from "../item.js";

export class Consumable extends Item {
  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText: string;
  }) {
    super({ ...args, pos: new Position(GAMEWIDTH - 20, 72) });
    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      if (button == LEFT) {
        return new ConsumeItem(this.name);
      }
      return new SellItem(this);
    };
  }
}
