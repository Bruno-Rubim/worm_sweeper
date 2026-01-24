import { SellItem, UseActiveItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { GAMEWIDTH, LEFT } from "../../global.js";
import { Item } from "../item.js";
export class ActiveItem extends Item {
    isAlt;
    constructor(args) {
        super({ ...args, pos: args.pos ?? new Position(GAMEWIDTH - 20, 72) });
        this.isAlt = args.isAlt ?? false;
        this.clickFunction = (cursorPos, button) => {
            if (button == LEFT) {
                return new UseActiveItem(this.isAlt);
            }
            else {
                return new SellItem(this);
            }
        };
    }
    clone(position, isAlt) {
        return new ActiveItem({
            pos: new Position(position),
            spriteSheetPos: this.spriteSheetPos,
            name: this.name,
            shopName: this.shopName,
            cost: this.cost,
            descriptionText: this.descriptionText,
            isAlt: isAlt ?? this.isAlt,
        });
    }
}
