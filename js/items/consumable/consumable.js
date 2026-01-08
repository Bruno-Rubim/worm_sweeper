import { GAMEWIDTH } from "../../global.js";
import { ConsumeItem } from "../../action.js";
import Position from "../../position.js";
import { Item } from "../item.js";
export class Consumable extends Item {
    constructor(args) {
        super({ ...args, pos: new Position(GAMEWIDTH - 20, 72) });
        this.clickFunction = () => {
            return new ConsumeItem(this.name);
        };
    }
}
