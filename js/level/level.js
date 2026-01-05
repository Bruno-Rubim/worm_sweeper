import Cave from "./cave.js";
import Shop from "./shop.js";
export default class Level {
    depth;
    shop;
    cave;
    inventory;
    constructor(depth, inventory) {
        this.depth = depth;
        this.cave = new Cave(depth);
        this.shop = new Shop(inventory);
        this.inventory = inventory;
    }
    nextLevel() {
        return new Level(this.depth + 1, this.inventory);
    }
}
