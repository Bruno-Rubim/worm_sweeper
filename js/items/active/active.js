import Position from "../../gameElements/position.js";
import { Item } from "../item.js";
export class ActiveItem extends Item {
    constructor(args) {
        super({ ...args });
    }
    get finalCost() {
        return this.cost;
    }
}
