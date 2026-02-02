import Position from "../../gameElements/position.js";
import { Item } from "../item.js";

export class ActiveItem extends Item {
  constructor(args: {
    isAlt?: boolean;
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText: string;
  }) {
    super({ ...args });
  }

  get finalCost(): number {
    return this.cost;
  }
}
