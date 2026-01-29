import Position from "../gameElements/position.js";
export class Item {
    spriteSheetPos;
    name;
    shopName;
    descriptionText;
    descFontSize = 0.4;
    cost;
    lootItem = false;
    constructor(args) {
        this.spriteSheetPos = args.spriteSheetPos;
        this.name = args.name;
        this.shopName = args.shopName;
        this.cost = args.cost;
        this.descriptionText = args.descriptionText;
    }
    get description() {
        return this.descriptionText;
    }
    get finalCost() {
        return this.cost;
    }
}
