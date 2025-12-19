import Block, { DOOREXIT, DOORSHOP, WORM } from "./block.js";
import Position from "../position.js";
import Shop from "./shop.js";

export default class Level {
  depth: number;
  size: number;
  difficulty: number;
  shop: Shop | undefined;
  wormQuantity: number;
  wormsLeft: number;
  blockCount: number;
  levelScale: number;
  blockMatrix: Block[][] = [];
  freeTiles: Block[] = [];
  started = false;
  cleared = false;

  constructor(args: {
    depth?: number;
    size?: number;
    difficulty?: number;
    shop?: Shop;
  }) {
    this.depth = args.depth ?? 0;
    this.size = args.size ?? 6;
    this.difficulty = args.difficulty ?? 4;
    this.shop = args.shop;
    this.wormQuantity = Math.floor(
      this.difficulty * 0.033 * this.size * this.size
    );
    this.wormsLeft = this.wormQuantity;
    this.blockCount = this.size * this.size - this.wormsLeft;
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
              j * 16 * this.levelScale
            ),
          })
      )
    );
  }

  setFreeTiles() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const block = this.blockMatrix[i]![j]!;
        if (!block.starter) {
          this.freeTiles.push(block);
        }
      }
    }
  }

  placeGold() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const block = this.blockMatrix[i]![j]!;
        if (block.starter) {
          continue;
        }
        const rngGold = Math.floor(Math.random() * 1.7);
        block.hasGold = rngGold >= 1;
      }
    }
  }

  getSurrBlocks(pos: Position): Block[] {
    let surrBlocks: Block[] = [];
    if (pos.x != 0) {
      surrBlocks.push(this.blockMatrix[pos.x - 1]![pos.y]!);
      if (pos.y != 0) {
        surrBlocks.push(this.blockMatrix[pos.x - 1]![pos.y - 1]!);
      }
    }
    if (pos.y != 0) {
      surrBlocks.push(this.blockMatrix[pos.x]![pos.y - 1]!);
      if (pos.x != this.size - 1) {
        surrBlocks.push(this.blockMatrix[pos.x + 1]![pos.y - 1]!);
      }
    }
    if (pos.x != this.size - 1) {
      surrBlocks.push(this.blockMatrix[pos.x + 1]![pos.y]!);
      if (pos.y != this.size - 1) {
        surrBlocks.push(this.blockMatrix[pos.x + 1]![pos.y + 1]!);
      }
    }
    if (pos.y != this.size - 1) {
      surrBlocks.push(this.blockMatrix[pos.x]![pos.y + 1]!);
      if (pos.x != 0) {
        surrBlocks.push(this.blockMatrix[pos.x - 1]![pos.y + 1]!);
      }
    }
    return surrBlocks;
  }

  getAdjcBlocks(pos: Position) {
    let surrBlocks = [];
    if (pos.x != 0) {
      surrBlocks.push(this.blockMatrix[pos.x - 1]![pos.y]!);
    }
    if (pos.y != 0) {
      surrBlocks.push(this.blockMatrix[pos.x]![pos.y - 1]!);
    }
    if (pos.x != this.size - 1) {
      surrBlocks.push(this.blockMatrix[pos.x + 1]![pos.y]!);
    }
    if (pos.y != this.size - 1) {
      surrBlocks.push(this.blockMatrix[pos.x]![pos.y + 1]!);
    }
    return surrBlocks;
  }

  revealAdjc(pos: Position) {
    this.getAdjcBlocks(pos).forEach((block) => {
      if (block == undefined) {
        return;
      }
      if (block.hidden) {
        block.hidden = false;
      }
    });
  }

  updateBlockThreatLevel(block: Block) {
    let threatLevel = 0;
    this.getSurrBlocks(block.gridPos).forEach((b) => {
      if (b.content == WORM) {
        threatLevel++;
      }
    });
    block.threatLevel = threatLevel;
  }

  countBrokenBlocks() {
    let counter = this.size * this.size;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.blockMatrix[i]![j]!.broken) {
          counter--;
        }
      }
    }
    return counter;
  }

  checkClear() {
    if (
      this.countBrokenBlocks() == this.wormQuantity &&
      this.wormsLeft == 0 &&
      !this.cleared
    ) {
      this.cleared = true;
      // gameManager.gold += 5;
    }
  }

  breakBlock(block: Block) {
    // if (block.marker != null) {
    //   return;
    // }
    block.broken = true;
    if (block.hasGold) {
      //   gameManager.gold++;
    }
    this.checkClear();
    this.revealAdjc(block.gridPos);
    // if (block.wormLevel == 0 && block.content != WORM) {
    //   if (gameManager.inventory.includes(drillItem)) {
    //     block.breakSurr();
    //   }
    // }
    if (block.content == WORM) {
      //   setTimeout(() => {
      //     block.content = null;
      //     this.startBattle();
      //   }, 500);
    } else {
      this.blockCount--;
    }
    this.updateBlockThreatLevel(block);
  }

  markBlock(block: Block) {
    block.marked = !block.marked;
    if (block.marked) {
      this.wormsLeft--;
    } else {
      this.wormsLeft++;
    }
  }

  breakSurrBlocks(pos: Position) {
    const surrBlocks = this.getSurrBlocks(pos);
    surrBlocks.forEach((block) => {
      if (block.broken) {
        return;
      }
      this.breakBlock(block);
    });
  }

  placeExit() {
    if (this.freeTiles.length == 0) {
      console.warn("drake...");
      return;
    }
    const r = Math.floor(Math.random() * this.freeTiles.length);
    const block = this.freeTiles[r]!;
    this.freeTiles.splice(r, 1);
    block.content = DOOREXIT;

    this.getSurrBlocks(block.gridPos).forEach((b) => {
      for (let i = 0; i < this.freeTiles.length; i++) {
        if (this.freeTiles[i] == b) {
          this.freeTiles.splice(i, 1);
          i--;
        }
      }
    });
  }

  placeWorms() {
    if (this.freeTiles.length < this.wormQuantity) {
      window.alert("not enough worms");
    }
    let wormsPlaced = 0;
    if (this.wormQuantity > Math.floor((this.size * this.size) / 3)) {
      this.wormQuantity = Math.floor((this.size * this.size) / 3);
    }
    for (let i = 0; wormsPlaced < this.wormQuantity && i < 300; i++) {
      const r = Math.floor(Math.random() * this.freeTiles.length);
      const block = this.freeTiles[r]!;
      block.content = "worm";
      wormsPlaced++;
      this.freeTiles.splice(r, 1);
    }
  }

  emptySurrBlocks(pos: Position) {
    this.getSurrBlocks(pos).forEach((block) => {
      for (let i = 0; i < this.freeTiles.length; i++) {
        if (this.freeTiles[i] == block) {
          this.freeTiles.splice(i, 1);
          i--;
        }
      }
    });
  }

  placeShop() {
    if (this.freeTiles.length == 0) {
      console.warn("drake...");
      return;
    }
    const r = Math.floor(Math.random() * this.freeTiles.length);
    const block = this.freeTiles[r]!;
    block.content = DOORSHOP;
    this.freeTiles.splice(r, 1);
    this.emptySurrBlocks(block.gridPos);
  }

  start(startPos: Position) {
    this.fillEmptyBlocks();
    const firstBlock = this.blockMatrix[startPos.x]![startPos.y]!;
    firstBlock.starter = true;
    this.breakBlock(firstBlock);
    this.getSurrBlocks(firstBlock.gridPos).forEach((block) => {
      block.starter = true;
    });
    this.setFreeTiles();
    this.placeGold();
    this.placeExit();
    if (this.shop) {
      this.placeShop();
    }
    this.placeWorms();
    this.breakSurrBlocks(firstBlock.gridPos);
    this.started = true;
  }

  nextLevel() {
    const nextDepth = this.depth + 1;
    let nextSize = Math.floor(nextDepth / 3) + 6;
    let nextDificulty = (nextDepth % 3) + Math.floor(nextDepth / 3) + 4;
    let nextShop = new Shop({});
    return new Level({
      difficulty: nextDificulty,
      size: nextSize,
      depth: nextDepth,
      shop: nextShop,
    });
  }
}
