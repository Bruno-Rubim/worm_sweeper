import Cave from "./cave/cave.js";
import Shop from "./shop/shop.js";

// Object represents the game data of a level
export default class Level {
  depth: number;
  shop: Shop;
  cave: Cave;

  constructor(depth: number) {
    this.depth = depth;
    this.cave = new Cave(depth);
    this.shop = new Shop();
  }

  nextLevel() {
    return new Level(this.depth + 1);
  }
}
