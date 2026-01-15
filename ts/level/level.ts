import type GameState from "../gameState.js";
import Cave from "./cave/cave.js";
import Shop from "./shop/shop.js";

// Object represents the game data of a level
export default class Level {
  depth: number;
  shop: Shop;
  cave: Cave;
  gameState: GameState;

  constructor(depth: number, inventory: GameState) {
    this.depth = depth;
    this.cave = new Cave(depth);
    this.shop = new Shop(inventory);
    this.gameState = inventory;
  }

  nextLevel() {
    return new Level(this.depth + 1, this.gameState);
  }
}
