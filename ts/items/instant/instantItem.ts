import Position from "../../gameElements/position.js";
import { Item } from "../item.js";

export class InstantItem extends Item {
  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText: string;
  }) {
    super({ ...args });
  }
}
