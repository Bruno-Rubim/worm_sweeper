import Position from "../gameElements/position.js";

export class Item {
  spriteSheetPos: Position;
  name: string;
  shopName: string;
  descriptionText: string;
  descFontSize = 0.4;
  cost: number;
  lootItem: boolean = false;

  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText?: string;
  }) {
    this.spriteSheetPos = args.spriteSheetPos;
    this.name = args.name;
    this.shopName = args.shopName;
    this.cost = args.cost;

    this.descriptionText = args.descriptionText ?? "";
  }

  get description() {
    return this.descriptionText;
  }

  get finalCost() {
    return this.cost;
  }
}
