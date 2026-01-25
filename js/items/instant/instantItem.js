import { GAMEWIDTH, LEFT } from "../../global.js";
import { ConsumeItem, SellItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { Item } from "../item.js";
export class InstantItem extends Item {
    constructor(args) {
        super({ ...args });
        this.clickFunction = (cursorPos, button) => {
            if (button == LEFT) {
                return new ConsumeItem(this.name);
            }
            return new SellItem(this);
        };
    }
}
