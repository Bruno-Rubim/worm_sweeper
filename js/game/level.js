import { ctx, renderScale } from "../canvas_handler.js";
import { findSprite } from "../sprites.js";
import { Battle } from "./battle.js";
import { Block } from "./blocks.js";
import { borderThicness, gameManager } from "./game_manager.js";
import { Shop } from "./shop.js";

export class Level {
  constructor({ depth = 0, size = 6, difficulty = 4, shop = null }) {
    this.depth = depth;
    this.size = size;
    this.difficulty = difficulty;
    this.shop = shop;
    this.inShop = false;
    this.wormQuantity = Math.floor(difficulty * 0.033 * size * size);
    this.wormsLeft = this.wormQuantity;
    this.blockCount = size * size - this.wormsLeft;
    this.levelScale = 128 / (this.size * 16);
    this.blocks = [];
    this.freeTiles = [];
    this.started = false;
    this.cleared = false;
    this.currentBattle = null;
  }

  fillEmptyBlocks() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const block = new Block({ posX: i, posY: j, parentLevel: this });
        this.blocks[i].push(block);
      }
    }
  }
  setFreeTiles() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const block = this.blocks[i][j];
        if (!block.starter) {
          this.freeTiles.push(block);
        }
      }
    }
  }
  placeGold() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const block = this.blocks[i][j];
        if (block.starter) {
          continue;
        }
        const rngGold = Math.floor(Math.random() * 1.7);
        block.gold = rngGold;
      }
    }
  }
  placeExit() {
    if (this.freeTiles.length == 0) {
      console.warn("drake...");
      return;
    }
    const r = Math.floor(Math.random() * this.freeTiles.length);
    const block = this.freeTiles[r];
    block.content = "exit_door";
    this.freeTiles.splice(r, 1);
    block.surrBlocks.forEach((block) => {
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
    const block = this.freeTiles[r];
    block.content = "shop_door";
    this.freeTiles.splice(r, 1);
    block.surrBlocks.forEach((block) => {
      for (let i = 0; i < this.freeTiles.length; i++) {
        if (this.freeTiles[i] == block) {
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
      const block = this.freeTiles[r];
      block.content = "worm";
      wormsPlaced++;
      this.freeTiles.splice(r, 1);
    }
  }

  start(startX, startY) {
    for (let i = 0; i < this.size; i++) {
      this.blocks.push([]);
    }
    this.fillEmptyBlocks();
    const firstBlock = this.blocks[startX][startY];
    firstBlock.starter = true;
    firstBlock.surrBlocks.forEach((block) => {
      block.starter = true;
    });
    this.setFreeTiles();
    this.placeGold();
    this.placeExit();
    if (this.shop) {
      this.placeShop();
    }
    this.placeWorms();
    firstBlock.break();
    firstBlock.breakSurr();
    this.started = true;
  }

  renderBlocks() {
    if (this.blocks.length == 0) {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          ctx.drawImage(
            findSprite("dirt_block_hidden").img,
            (i * 16 * this.levelScale + borderThicness) * renderScale,
            (j * 16 * this.levelScale + borderThicness) * renderScale,
            16 * this.levelScale * renderScale,
            16 * this.levelScale * renderScale
          );
        }
      }
    } else {
      this.blocks.forEach((row) =>
        row.forEach((block) => {
          block.render(this.levelScale);
        })
      );
    }
  }
  renderShop() {
    this.shop.render();
  }
  render() {
    if (this.currentBattle) {
      this.currentBattle.render();
      return;
    }
    if (this.inShop) {
      this.renderShop();
      return;
    }
    this.renderBlocks();
  }

  countBrokenBlocks() {
    let counter = this.size * this.size;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.blocks[i][j].broken) {
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
      // gameManager.timer.addSeconds(20)
      gameManager.gold += 5;
    }
  }

  startBattle() {
    this.currentBattle = new Battle({ parentLevel: this });
    this.currentBattle.start();
  }

  nextLevel(startX, startY) {
    gameManager.timer.addSeconds(60);
    const nextDepth = this.depth + 1;
    let nextSize = Math.floor(nextDepth / 3) + 6;
    let nextDificulty = (nextDepth % 3) + Math.floor(nextDepth / 3) + 4;
    let nextShop = new Shop({
      inventory: gameManager.inventory,
      level: nextDepth,
    });
    gameManager.currentLevel = new Level({
      difficulty: nextDificulty,
      size: nextSize,
      depth: nextDepth,
      shop: nextShop,
    });
    gameManager.currentLevel.start(startX, startY);
  }
}

export const levelWithAShop = new Level({ shop: new Shop({ inventory: [] }) });
levelWithAShop.inShop = true;
