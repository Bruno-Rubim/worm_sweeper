import { SellItem, UseActiveItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { GAMEWIDTH, LEFT, type cursorClick } from "../../global.js";
import { Item } from "../item.js";

export class ActiveItem extends Item {
  isAlt: boolean;

  constructor(args: {
    pos?: Position;
    isAlt?: boolean;
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText: string;
  }) {
    super({ ...args, pos: args.pos ?? new Position(GAMEWIDTH - 20, 72) });

    this.isAlt = args.isAlt ?? false;

    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      if (button == LEFT) {
        return new UseActiveItem();
      } else {
        return new SellItem(this);
      }
    };
  }

  clone(position?: Position): ActiveItem {
    return new ActiveItem({
      pos: new Position(position),
      spriteSheetPos: this.spriteSheetPos,
      name: this.name,
      shopName: this.shopName,
      cost: this.cost,
      descriptionText: this.descriptionText,
      isAlt: this.isAlt,
    });
  }
}
