import Block from "./block.js";
import Position from "../../gameElements/position.js";
import { utils } from "../../utils.js";

export default class Cave {
  difficulty: number;
  size: number;
  hasShop: boolean;
  hasWater: boolean;
  hasBlood: boolean;
  goldChance = 0.3;
  wormQuantity: number;
  wormsLeft: number;
  blocksLeft: number;
  levelScale: number;
  blockMatrix: Block[][] = [];
  started = false;
  cleared = false;
  bellRang = false;

  constructor(depth: number) {
    this.difficulty = (depth % 4) + Math.floor(depth / 3) + 4;
    this.size = Math.floor(depth / 4) + 6;
    this.hasShop = depth > 0;
    this.hasWater = depth > 1 && Math.random() <= 0.25;
    this.hasBlood = depth > 5 && Math.random() <= 0.2;
    this.wormQuantity = Math.floor(
      this.difficulty * 0.033 * this.size * this.size,
    );
    this.wormsLeft = this.wormQuantity;
    this.blocksLeft = this.size * this.size - this.wormsLeft;
    this.levelScale = 128 / (this.size * 16);
    this.fillEmptyBlocks();
  }

  fillEmptyBlocks() {
    this.blockMatrix = Array.from({ length: this.size }, (_, i) =>
      Array.from(
        { length: this.size },
        (_, j) =>
          new Block({
            gridPos: new Position(i, j),
            gamePos: new Position(
              i * 16 * this.levelScale,
              j * 16 * this.levelScale,
            ),
          }),
      ),
    );
  }

  get allBLocks() {
    let blockArr: Block[] = [];
    this.blockMatrix.forEach((line) => {
      line.forEach((block) => {
        blockArr.push(block);
      });
    });
    return blockArr;
  }
}
