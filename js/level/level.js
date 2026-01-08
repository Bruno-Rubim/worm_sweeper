import Cave from "./cave.js";
import Shop from "./shop.js";
export default class Level {
    depth;
    shop;
    cave;
    gameState;
    constructor(depth, inventory) {
        this.depth = depth;
        this.cave = new Cave(depth);
        this.shop = new Shop(inventory);
        this.gameState = inventory;
    }
    nextLevel() {
        return new Level(this.depth + 1, this.gameState);
    }
}
