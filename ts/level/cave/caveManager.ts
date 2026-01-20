import {
  ChangeCursorState,
  ChangeScene,
  NextLevel,
  StartBattle,
} from "../../action.js";
import {
  CURSORARROW,
  CURSORDEFAULT,
  CURSORDETONATOR,
  CURSORGOLDWATER,
  CURSORPICAXE,
} from "../../cursor.js";
import { CLICKLEFT, type CLICKRIGHT } from "../../global.js";
import Position from "../../gameElements/position.js";
import sounds from "../../sounds.js";
import { sprites } from "../../sprites.js";
import Block, {
  blockSheetPos,
  CONTENTDOOREXIT,
  CONTENTDOOREXITOPEN,
  CONTENTDOORSHOP,
  CONTENTDOORSHOPOPEN,
  CONTENTEMPTY,
  CONTENTWATER,
  CONTENTWORM,
} from "./block.js";
import SceneManager from "../sceneManager.js";
import { gameState } from "../../gameState.js";
import { canvasManager } from "../../canvasManager.js";
import { soundManager } from "../../soundManager.js";
import { utils } from "../../utils.js";
import { hasItem } from "../../playerInventory.js";
import Bomb from "../../items/consumable/bomb.js";
import { Timer } from "../../timer/timer.js";

type breakResult = {
  battle: StartBattle;
  gold: number;
};

// Handles rendering and interactions with the cave scene of the current Level
export default class CaveManager extends SceneManager {
  bomb: null | {
    screenPos: Position;
    timer: Timer;
    hoverScreenPos: Position | null;
  } = null;

  get cave() {
    return gameState.level.cave;
  }

  /**
   * Returns a block that matches the position in relation to the screen
   * @param pos
   * @returns
   */
  getBlockFromScrenPos(pos: Position) {
    const blockPos = pos
      .subtract(this.pos)
      .divide(gameState.level.cave.levelScale * 16);
    return gameState.level.cave.blockMatrix[blockPos.x]![blockPos.y]!;
  }

  /**
   * Checks if the cave has been cleared (all worms marked and all blocks broken)
   */
  checkCaveClear() {
    if (
      this.cave.blocksLeft == 0 &&
      this.cave.wormsLeft == 0 &&
      !this.cave.cleared
    ) {
      this.cave.cleared = true;
      // if (hasItem("health_insurance")) {
      //   gameState.health++;
      // }
      gameState.gold += 5;
      gameState.gameTimer.addSecs(60);
      // if (hasItem("gold_bug")) {
      //   gameState.gold += 5;
      // }
      soundManager.playSound(sounds.clear);
    }
  }

  get blocksCanPlaceWorm() {
    return this.cave.allBLocks.filter(
      (block) =>
        block.content == CONTENTEMPTY &&
        !block.starter &&
        this.getSurrBlocks(block.gridPos).every(
          (b) => b.content == CONTENTEMPTY || b.content == CONTENTWORM,
        ),
    );
  }

  get blocksCanPlaceStuff() {
    this.updateAllStats();
    return this.cave.allBLocks.filter(
      (block) =>
        block.threatLevel == 0 &&
        !block.starter &&
        block.content == CONTENTEMPTY &&
        this.getAdjcBlocks(block.gridPos).every(
          (b) => b.content == CONTENTEMPTY,
        ),
    );
  }

  placeGold() {
    for (let i = 0; i < gameState.level.cave.size; i++) {
      for (let j = 0; j < gameState.level.cave.size; j++) {
        const block = this.cave.blockMatrix[i]![j]!;
        if (block.starter) {
          continue;
        }
        const rngGold = Math.floor(
          Math.random() * gameState.level.cave.goldChance,
        );
        if (rngGold >= 1) {
          block.hasGold = true;
        }
      }
    }
  }

  getSurrBlocks(gridPos: Position): Block[] {
    let surrBlocks: Block[] = [];
    if (gridPos.x != 0) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x - 1]![gridPos.y]!);
      if (gridPos.y != 0) {
        surrBlocks.push(this.cave.blockMatrix[gridPos.x - 1]![gridPos.y - 1]!);
      }
    }
    if (gridPos.y != 0) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x]![gridPos.y - 1]!);
      if (gridPos.x != gameState.level.cave.size - 1) {
        surrBlocks.push(this.cave.blockMatrix[gridPos.x + 1]![gridPos.y - 1]!);
      }
    }
    if (gridPos.x != gameState.level.cave.size - 1) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x + 1]![gridPos.y]!);
      if (gridPos.y != gameState.level.cave.size - 1) {
        surrBlocks.push(this.cave.blockMatrix[gridPos.x + 1]![gridPos.y + 1]!);
      }
    }
    if (gridPos.y != gameState.level.cave.size - 1) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x]![gridPos.y + 1]!);
      if (gridPos.x != 0) {
        surrBlocks.push(this.cave.blockMatrix[gridPos.x - 1]![gridPos.y + 1]!);
      }
    }
    return surrBlocks;
  }

  getAdjcBlocks(gridPos: Position) {
    let surrBlocks = [];
    if (gridPos.x != 0) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x - 1]![gridPos.y]!);
    }
    if (gridPos.y != 0) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x]![gridPos.y - 1]!);
    }
    if (gridPos.x != gameState.level.cave.size - 1) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x + 1]![gridPos.y]!);
    }
    if (gridPos.y != gameState.level.cave.size - 1) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x]![gridPos.y + 1]!);
    }
    return surrBlocks;
  }

  revealAdjc(gridPos: Position) {
    this.getAdjcBlocks(gridPos).forEach((block) => {
      if (block == undefined) {
        return;
      }
      if (block.hidden) {
        block.hidden = false;
      }
    });
  }

  updateBlockStats(block: Block) {
    let threatLevel = 0;
    let markerLevel = 0;
    this.getSurrBlocks(block.gridPos).forEach((b) => {
      if (b.content == CONTENTWORM) {
        threatLevel++;
      }
      if (b.marked) {
        markerLevel++;
      }
    });
    block.threatLevel = threatLevel;
    block.markerLevel = markerLevel;
  }

  clearExposedWorms() {
    this.cave.blockMatrix.forEach((line) => {
      line.forEach((block) => {
        if (block.content == CONTENTWORM && block.broken) {
          block.content = CONTENTEMPTY;
        }
      });
    });
  }

  bombBlock(block: Block) {
    if (block.content == CONTENTWORM) {
      block.content = CONTENTEMPTY;
      if (block.marked) {
        block.marked = false;
      } else {
        this.cave.wormsLeft--;
      }
    } else {
      if (block.marked) {
        block.marked = false;
        this.cave.wormsLeft++;
      }
      this.cave.blocksLeft--;
    }
    block.broken = true;
    this.getSurrBlocks(block.gridPos).forEach((b) => {
      if (b.content == CONTENTWORM) {
        b.content = CONTENTEMPTY;
        this.cave.wormsLeft--;
        this.cave.blocksLeft++;
      }
    });
    this.breakSurrBlocks(block.gridPos, true);
    this.updateAllStats();
  }

  updateAllStats() {
    this.cave.blockMatrix.forEach((line) => {
      line.forEach((block) => {
        this.updateBlockStats(block);
      });
    });
  }

  revealAllBlocks() {
    this.cave.blockMatrix.forEach((line) => {
      line.forEach((block) => {
        block.broken = true;
      });
    });
    this.updateAllStats();
  }

  countBrokenBlocks() {
    let counter = this.cave.size * this.cave.size;
    for (let i = 0; i < this.cave.size; i++) {
      for (let j = 0; j < this.cave.size; j++) {
        if (this.cave.blockMatrix[i]![j]!.broken) {
          counter--;
        }
      }
    }
    return counter;
  }

  breakBlock(block: Block) {
    let result: breakResult = { battle: new StartBattle(0), gold: 0 };
    block.broken = true;
    this.revealAdjc(block.gridPos);

    if (block.content != CONTENTWORM) {
      gameState.level.cave.blocksLeft--;
    } else {
      result.battle.enemyCount++;
    }
    if (block.hasGold) {
      result.gold++;
    }
    this.updateBlockStats(block);
    return result;
  }

  breakConnectedEmpty(block: Block) {
    let totalResult: breakResult = {
      battle: new StartBattle(0),
      gold: 0,
    };
    if (block.threatLevel == 0 && !block.marked) {
      totalResult.gold += this.breakSurrBlocks(block.gridPos).gold;
    }
    this.getSurrBlocks(block.gridPos).forEach((b) => {
      if (b.threatLevel == 0 && !b.drilled) {
        b.drilled = true;
        totalResult.gold += this.breakConnectedEmpty(b).gold;
      }
    });
    return totalResult;
  }

  markBlock(block: Block) {
    block.marked = !block.marked;
    this.getSurrBlocks(block.gridPos).forEach((b) => {
      this.updateBlockStats(b);
    });
    if (block.marked) {
      this.cave.wormsLeft--;
    } else {
      this.cave.wormsLeft++;
    }
  }

  breakSurrBlocks(pos: Position, ignoreMarks: boolean = false) {
    let totalResult: breakResult = {
      battle: new StartBattle(0),
      gold: 0,
    };
    const surrBlocks = this.getSurrBlocks(pos);
    surrBlocks.forEach((block) => {
      if (block.broken || (block.marked && !ignoreMarks)) {
        return;
      }
      let result = this.breakBlock(block);
      if (block.marked) {
        block.marked = false;
        this.cave.wormsLeft++;
      }
      totalResult.battle.enemyCount += result.battle.enemyCount;
      totalResult.gold += result.gold;
    });
    return totalResult;
  }

  placeExit() {
    if (this.blocksCanPlaceStuff.length == 0) {
      console.warn("drake...");
      return;
    }
    const r = utils.randomArrayId(this.blocksCanPlaceStuff);
    const block = this.blocksCanPlaceStuff[r]!;
    block.content = CONTENTDOOREXIT;
  }

  placeWorms() {
    if (this.blocksCanPlaceWorm.length < this.cave.wormQuantity) {
      window.alert("not enough worms");
    }
    let wormsPlaced = 0;
    for (let i = 0; wormsPlaced < this.cave.wormQuantity && i < 300; i++) {
      const r = utils.randomArrayId(this.blocksCanPlaceWorm);
      const block = this.blocksCanPlaceWorm[r]!;
      block.content = CONTENTWORM;
      wormsPlaced++;
    }
    this.updateAllStats();
  }

  placeShop() {
    if (this.blocksCanPlaceStuff.length == 0) {
      console.warn("no shop :c");
      return;
    }
    const r = utils.randomArrayId(this.blocksCanPlaceStuff);
    const block = this.blocksCanPlaceStuff[r]!;
    block.content = CONTENTDOORSHOP;
  }

  placeWater() {
    if (this.blocksCanPlaceStuff.length == 0) {
      return;
    }
    const r = utils.randomArrayId(this.blocksCanPlaceStuff);
    const block = this.blocksCanPlaceStuff[r]!;
    block.content = CONTENTWATER;
  }

  startCave(startPos: Position) {
    if (hasItem("gold_bug")) {
      gameState.level.cave.wormQuantity = Math.ceil(
        gameState.level.cave.wormQuantity * 1.2,
      );
      gameState.level.cave.wormsLeft = gameState.level.cave.wormQuantity;
      gameState.level.cave.goldChance += 0.3;
      gameState.level.cave.blocksLeft =
        gameState.level.cave.size * gameState.level.cave.size -
        gameState.level.cave.wormsLeft;
    }
    const firstBlock = this.cave.blockMatrix[startPos.x]![startPos.y]!;
    firstBlock.starter = true;
    this.breakBlock(firstBlock);
    this.getSurrBlocks(firstBlock.gridPos).forEach((block) => {
      block.starter = true;
    });
    this.placeGold();
    this.placeExit();
    if (gameState.level.cave.hasShop) {
      this.placeShop();
    }
    this.placeWorms();
    if (gameState.level.cave.hasWater) {
      this.placeWater();
    }
    this.breakSurrBlocks(firstBlock.gridPos);
    gameState.level.cave.started = true;
  }

  /**
   * Renders all blocks in the cave
   */
  render = () => {
    const blockSize = 16 * gameState.level.cave.levelScale;
    for (let i = 0; i < gameState.level.cave.size; i++) {
      for (let j = 0; j < gameState.level.cave.size; j++) {
        const blockPos = new Position(i * blockSize, j * blockSize).add(
          this.pos,
        );
        const block = this.cave.blockMatrix[i]![j]!;
        // Renders all block as hidden when game hasn't started
        if (!gameState.level.cave.started) {
          canvasManager.renderSpriteFromSheet(
            sprites.block_sheet,
            blockPos,
            blockSize,
            blockSize,
            blockSheetPos.hidden,
            16,
            16,
          );
          continue;
        }

        //Renders block
        canvasManager.renderSpriteFromSheet(
          sprites.block_sheet,
          blockPos,
          blockSize,
          blockSize,
          block.sheetBlockPos,
          16,
          16,
        );

        //Renders content
        if ((block.broken && block.content != CONTENTEMPTY) || block.marked) {
          canvasManager.renderSpriteFromSheet(
            sprites.block_sheet,
            blockPos,
            blockSize,
            blockSize,
            block.sheetContentPos.add(0, 0),
            16,
            16,
          );
        }

        //Renders bell
        if (
          gameState.level.cave.bellRang &&
          [CONTENTDOOREXIT, CONTENTDOORSHOP].includes(block.content) &&
          !block.broken
        ) {
          canvasManager.renderSpriteFromSheet(
            sprites.block_sheet,
            blockPos,
            blockSize,
            blockSize,
            blockSheetPos.bell,
            16,
            16,
          );
        }
      }
    }

    // Renders Bomb
    if (this.bomb) {
      const block = this.getBlockFromScrenPos(this.bomb.screenPos);
      const blockPos = new Position(
        block.gridPos.x * blockSize,
        block.gridPos.y * blockSize,
      ).add(this.pos);
      let framePos = new Position();
      if (!this.bomb.hoverScreenPos) {
        framePos = new Position(
          Math.min(
            2,
            Math.floor(this.bomb.timer.percentage / ((1 / 3) * 100)),
          ) + 1,
          0,
        );
      }
      canvasManager.renderSpriteFromSheet(
        sprites.bomb_sheet,
        blockPos,
        blockSize,
        blockSize,
        framePos,
        16,
        16,
      );
    }
  };

  // TO-DO: make a handleAction function for this element instead of leaving it all for the handleClick
  handleClick = (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT,
  ) => {
    const block = this.getBlockFromScrenPos(cursorPos);
    if (!this.cave.started) {
      // Start game
      this.startCave(
        block.gridPos,
        // gameState.itemNames,
      );
      soundManager.playSound(sounds.break);
      if (!gameState.started) {
        // soundManager.playMusic(music.drums);
        gameState.started = true;
        gameState.gameTimer.start();
      }
      return;
    }

    if (button == CLICKLEFT) {
      if (gameState.holding instanceof Bomb) {
        // Bomb functionality
        if (block.broken && block.content != CONTENTEMPTY) {
          return;
        }
        this.bomb = {
          screenPos: new Position(cursorPos),
          timer: new Timer({
            goalSecs: 1.9,
            goalFunc: () => {
              this.bombBlock(block);
              soundManager.playSound(sounds.break);
              soundManager.playSound(sounds.break);
              soundManager.playSound(sounds.break);
              soundManager.playSound(sounds.break);
              this.checkCaveClear();
              this.bomb = null;
              soundManager.playSound(sounds.explosion);
            },
          }),
          hoverScreenPos: null,
        };
        soundManager.playSound(sounds.bomb_fuse);
        gameState.holding = null;
        return;
      }
      let enemyCount = 0;
      if (
        !block.broken &&
        (!block.hidden || hasItem("dark_crystal")) &&
        !block.marked
      ) {
        // Regular block break
        soundManager.playSound(sounds.break);
        let breakResult = this.breakBlock(block);
        enemyCount += breakResult.battle.enemyCount;
        gameState.gold += breakResult.gold;

        if (breakResult.gold > 0) {
          soundManager.playSound(sounds.gold);
        }
        if (hasItem("drill") && block.threatLevel == 0) {
          soundManager.playSound(sounds.drill);
          this.breakConnectedEmpty(block);
        }
      } else if (block.broken) {
        switch (block.content) {
          case CONTENTDOOREXIT:
            soundManager.playSound(sounds.door);
            block.content = CONTENTDOOREXITOPEN;
            break;
          case CONTENTDOOREXITOPEN:
            soundManager.playSound(sounds.steps);
            return new NextLevel(block.gridPos);
          case CONTENTDOORSHOP:
            soundManager.playSound(sounds.door);
            block.content = CONTENTDOORSHOPOPEN;
            break;
          case CONTENTDOORSHOPOPEN:
            soundManager.playSound(sounds.steps);
            return new ChangeScene("shop");
          case CONTENTWATER:
            // soundManager.playSound(); TO-DO: water sfx
            gameState.gold += 1;
            soundManager.playSound(sounds.gold);
            gameState.gameTimer.addSecs(-10);
            break;
          case CONTENTEMPTY:
            if (
              hasItem("detonator") &&
              block.threatLevel > 0 &&
              block.threatLevel == block.markerLevel
            ) {
              let breakResult = this.breakSurrBlocks(block.gridPos);
              soundManager.playSound(sounds.detonate);
              if (hasItem("drill")) {
                this.breakConnectedEmpty(block);
              }
              enemyCount += breakResult.battle.enemyCount;
              if (breakResult.gold > 0) {
                soundManager.playSound(sounds.gold);
              }
              gameState.gold += breakResult.gold;
            }
            break;
        }
      }
      if (enemyCount > 0) {
        return new StartBattle(enemyCount);
      } else {
        this.checkCaveClear();
      }
    } else {
      if (!block.broken) {
        this.markBlock(block);
        this.checkCaveClear();
      }
    }
  };

  handleHover = (cursorPos: Position) => {
    this.cave.allBLocks.forEach((block) => {
      block.cursorHovering = false;
    });
    const block = this.getBlockFromScrenPos(cursorPos);
    block.cursorHovering = true;
    if (gameState.holding instanceof Bomb) {
      this.bomb = {
        hoverScreenPos: cursorPos,
        screenPos: new Position(cursorPos),
        timer: new Timer({}),
      };
    }
    if (block.broken) {
      if (block.content == CONTENTWATER) {
        return new ChangeCursorState(CURSORGOLDWATER);
      }
      if (
        hasItem("detonator") &&
        block.threatLevel > 0 &&
        block.threatLevel == block.markerLevel
      ) {
        return new ChangeCursorState(CURSORDETONATOR);
      }
    }
    if (
      block.broken &&
      [CONTENTDOOREXIT, CONTENTDOORSHOP].includes(block.content)
    ) {
      return new ChangeCursorState(CURSORDEFAULT);
    }
    if (
      block.broken &&
      [CONTENTDOOREXITOPEN, CONTENTDOORSHOPOPEN].includes(block.content)
    ) {
      return new ChangeCursorState(CURSORARROW);
    }
    return new ChangeCursorState(CURSORPICAXE);
  };

  handleNotHover = () => {
    if (this.bomb?.hoverScreenPos) {
      this.bomb = null;
    }
  };
}
