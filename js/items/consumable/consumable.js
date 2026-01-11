import { GAMEWIDTH, LEFT } from "../../global.js";
import { ConsumeItem, SellItem } from "../../action.js";
import Position from "../../position.js";
import { Item } from "../item.js";
export class Consumable extends Item {
    constructor(args) {
        super({ ...args, pos: new Position(GAMEWIDTH - 20, 72) });
        this.clickFunction = (cursorPos, button) => {
            if (button == LEFT) {
                return new ConsumeItem(this.name);
            }
            return new SellItem(this);
        };
    }
}
