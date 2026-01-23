import { SellItem, UseActiveItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { GAMEWIDTH, LEFT, type cursorClick } from "../../global.js";
import { Item } from "../item.js";

export class ActiveItem extends Item {
  constructor(args: {
    pos?: Position;
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText: string;
  }) {
    super({ ...args, pos: new Position(GAMEWIDTH - 20, 72) });
    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      if (button == LEFT) {
        return new UseActiveItem();
      } else {
        return new SellItem(this);
      }
    };
  }
}
