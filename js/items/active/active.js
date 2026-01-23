import { SellItem, UseActiveItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { GAMEWIDTH, LEFT } from "../../global.js";
import { Item } from "../item.js";
export class ActiveItem extends Item {
    constructor(args) {
        super({ ...args, pos: new Position(GAMEWIDTH - 20, 72) });
        this.clickFunction = (cursorPos, button) => {
            if (button == LEFT) {
                return new UseActiveItem();
            }
            else {
                return new SellItem(this);
            }
        };
    }
}
