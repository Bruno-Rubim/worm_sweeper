import Position from "../../gameElements/position.js";
import { Item } from "../item.js";

export class ActiveItem extends Item {
  constructor(args: {
    pos?: Position;
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
    // if (this.name == "bomb" && hasItem("gunpowder")) {
    //   return Math.ceil(this.cost / 2);
    // }
    return this.cost;
  }
}
