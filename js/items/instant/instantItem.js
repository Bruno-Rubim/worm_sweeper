import Position from "../../gameElements/position.js";
import { Item } from "../item.js";
export class InstantItem extends Item {
    constructor(args) {
        super({ ...args });
    }
}
