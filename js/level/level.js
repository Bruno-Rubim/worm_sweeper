import Cave from "./cave/cave.js";
import Shop from "./shop/shop.js";
export default class Level {
    depth;
    shop;
    cave;
    constructor(depth) {
        this.depth = depth;
        this.cave = new Cave(depth);
        this.shop = new Shop();
    }
    nextLevel() {
        return new Level(this.depth + 1);
    }
}
