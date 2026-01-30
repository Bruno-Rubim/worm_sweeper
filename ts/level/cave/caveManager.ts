import {
  ChangeCursorState,
  ChangeScene,
  LoseGame,
  NextLevel,
  StartBattle,
} from "../../action.js";
import {
  CURSORARROW,
  CURSORDEFAULT,
  CURSORDETONATOR,
  CURSORWATER,
  CURSORPICAXE,
  CURSORBLOOD,
} from "../../cursor.js";
import { CLICKLEFT, type CLICKRIGHT } from "../../global.js";
import Position from "../../gameElements/position.js";
import sounds from "../../sounds/sounds.js";
import { sprites } from "../../sprites.js";
import Block, {
  blockSheetPos,
  CONTENTBLOOD,
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
import { soundManager } from "../../sounds/soundManager.js";
import { utils } from "../../utils.js";
import { Timer } from "../../timer/timer.js";
import { musicTracks } from "../../sounds/music.js";
import timeTracker from "../../timer/timeTracker.js";
import playerInventory from "../../inventory/playerInventory.js";
import damageOverlay from "../damageOverlay.js";

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
   * Sets the animation start of damage overlay to current tic and makes sure it's not hidden
   */
  playDamageOverlay() {
    damageOverlay.hidden = false;
    damageOverlay.firstAnimationTic = timeTracker.currentGameTic;
  }

  /**
   * Returns a block that matches the position in relation to the screen
   * @param pos
   * @returns
   */
  getBlockFromScrenPos(pos: Position) {
    const blockPos = pos.subtract(this.pos).divide(this.cave.levelScale * 16);
    return this.cave.blockMatrix[blockPos.x]![blockPos.y]!;
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
      if (playerInventory.hasItem("health_insurance")) {
        gameState.health++;
        gameState.health = Math.min(gameState.maxHealth, gameState.health);
      }
      gameState.gold += 5;
      gameState.gameTimer.addSecs(60);
      if (playerInventory.hasItem("gold_bug")) {
        gameState.gold += 5;
      }
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

  get blocksCanPlaceChest() {
    this.updateAllStats();
    return this.cave.allBLocks.filter(
      (block) =>
        !block.starter &&
        block.content == CONTENTWORM &&
        this.getAdjcBlocks(block.gridPos).every(
          (b) =>
            !b.starter &&
            (b.content == CONTENTWORM || b.content == CONTENTEMPTY) &&
            this.getSurrBlocks(b.gridPos).every(
              (c) => c.content == CONTENTWORM || c.content == CONTENTEMPTY,
            ),
        ),
    );
  }

  placeGold() {
    for (let i = 0; i < this.cave.size; i++) {
      for (let j = 0; j < this.cave.size; j++) {
        const block = this.cave.blockMatrix[i]![j]!;
        if (block.starter) {
          continue;
        }
        if (Math.random() <= this.cave.goldChance) {
          block.hasGold = true;
        }
      }
    }
  }

  /**
   * Returns an array with the blocks surrounding the given position
   * @param gridPos position of the center block
   * @param extra extend area by 1 on each side
   * @returns
   */
  getSurrBlocks(gridPos: Position, extra: boolean = false): Block[] {
    let validPositions: [number, number][] = [];
    if (gridPos.x > 0) {
      validPositions.push([gridPos.x - 1, gridPos.y]);
      if (gridPos.y > 0) {
        validPositions.push([gridPos.x - 1, gridPos.y - 1]);
      }
      if (gridPos.y < this.cave.size - 1) {
        validPositions.push([gridPos.x - 1, gridPos.y + 1]);
      }
    }

    if (gridPos.x < this.cave.size - 1) {
      validPositions.push([gridPos.x + 1, gridPos.y]);
      if (gridPos.y > 0) {
        validPositions.push([gridPos.x + 1, gridPos.y - 1]);
      }
      if (gridPos.y < this.cave.size - 1) {
        validPositions.push([gridPos.x + 1, gridPos.y + 1]);
      }
    }

    if (gridPos.y > 0) {
      validPositions.push([gridPos.x, gridPos.y - 1]);
    }
    if (gridPos.y < this.cave.size - 1) {
      validPositions.push([gridPos.x, gridPos.y + 1]);
    }

    if (extra) {
      if (gridPos.x > 1) {
        validPositions.push([gridPos.x - 2, gridPos.y]);
        if (gridPos.y > 0) {
          validPositions.push([gridPos.x - 2, gridPos.y - 1]);
          if (gridPos.y > 1) {
            validPositions.push([gridPos.x - 2, gridPos.y - 2]);
          }
        }
        if (gridPos.y < this.cave.size - 1) {
          validPositions.push([gridPos.x - 2, gridPos.y + 1]);
          if (gridPos.y < this.cave.size - 2) {
            validPositions.push([gridPos.x - 2, gridPos.y + 2]);
          }
        }
      }

      if (gridPos.x < this.cave.size - 2) {
        validPositions.push([gridPos.x + 2, gridPos.y]);
        if (gridPos.y > 0) {
          validPositions.push([gridPos.x + 2, gridPos.y - 1]);
          if (gridPos.y > 1) {
            validPositions.push([gridPos.x + 2, gridPos.y - 2]);
          }
        }
        if (gridPos.y < this.cave.size - 1) {
          validPositions.push([gridPos.x + 2, gridPos.y + 1]);
          if (gridPos.y < this.cave.size - 2) {
            validPositions.push([gridPos.x + 2, gridPos.y + 2]);
          }
        }
      }

      if (gridPos.y > 1) {
        validPositions.push([gridPos.x, gridPos.y - 2]);
        if (gridPos.x > 1) {
          validPositions.push([gridPos.x - 1, gridPos.y - 2]);
        }
        if (gridPos.x < this.cave.size - 1) {
          validPositions.push([gridPos.x + 1, gridPos.y - 2]);
        }
      }
      if (gridPos.y < this.cave.size - 2) {
        validPositions.push([gridPos.x, gridPos.y + 2]);
        if (gridPos.x > 1) {
          validPositions.push([gridPos.x - 1, gridPos.y + 2]);
        }
        if (gridPos.x < this.cave.size - 1) {
          validPositions.push([gridPos.x + 1, gridPos.y + 2]);
        }
      }
    }

    let surrBlocks = validPositions.map((p) => {
      const block = this.cave.blockMatrix[p[0]]![p[1]]!;
      return block;
    });
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
    if (gridPos.x != this.cave.size - 1) {
      surrBlocks.push(this.cave.blockMatrix[gridPos.x + 1]![gridPos.y]!);
    }
    if (gridPos.y != this.cave.size - 1) {
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
    if (!block.broken) {
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
    }
    this.getSurrBlocks(
      block.gridPos,
      // playerInventory.hasItem("gunpowder")
    ).forEach((b) => {
      if (b.content == CONTENTWORM) {
        b.content = CONTENTEMPTY;
        this.cave.wormsLeft--;
        this.cave.blocksLeft++;
      }
    });
    this.breakSurrBlocks(
      block.gridPos,
      true,
      // playerInventory.hasItem("gunpowder")
    );
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

  breakBlock(block: Block, quiet: boolean = false) {
    let result: breakResult = { battle: new StartBattle(0, false), gold: 0 };
    block.broken = true;
    this.revealAdjc(block.gridPos);

    if (block.content != CONTENTWORM) {
      this.cave.blocksLeft--;
    } else {
      result.battle.enemyCount++;
    }
    if (block.hasGold) {
      result.gold++;
    }
    if (block.hasChest) {
      result.battle.chest = true;
    }
    this.updateBlockStats(block);
    soundManager.playSound(sounds.break);
    return result;
  }

  breakConnectedEmpty(block: Block) {
    let totalResult: breakResult = {
      battle: new StartBattle(0, false),
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

  breakSurrBlocks(
    pos: Position,
    ignoreMarks: boolean = false,
    extraArea: boolean = false,
  ) {
    let totalResult: breakResult = {
      battle: new StartBattle(0, false),
      gold: 0,
    };
    const surrBlocks = this.getSurrBlocks(pos, extraArea);
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
      if (result.battle.chest) {
        totalResult.battle.chest = true;
      }
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

  placeFountain() {
    if (this.blocksCanPlaceStuff.length == 0) {
      return;
    }
    const r = utils.randomArrayId(this.blocksCanPlaceStuff);
    const block = this.blocksCanPlaceStuff[r]!;
    if (this.cave.hasBlood) {
      block.content = CONTENTBLOOD;
    } else {
      block.content = CONTENTWATER;
    }
  }

  placeChest() {
    if (this.blocksCanPlaceChest.length == 0) {
      console.warn("no chest for you, when will you learn");
      return;
    }
    const r = utils.randomArrayId(this.blocksCanPlaceChest);
    const block = this.blocksCanPlaceChest[r]!;
    this.getAdjcBlocks(block.gridPos).forEach((b) => {
      if (b.content != CONTENTWORM && this.blocksCanPlaceWorm.includes(b)) {
        b.content = CONTENTWORM;
        this.cave.wormsLeft++;
        this.cave.blocksLeft--;
      }
    });
    block.hasChest = true;
    block.hasGold = false;
  }

  startCave(startPos: Position) {
    // TO-DO: fix multiple bombs
    if (this.bomb) this.bomb.timer.goalFunc = undefined;
    this.bomb = null;
    if (gameState.bugCurse) {
      this.cave.wormQuantity = Math.ceil(this.cave.wormQuantity * 1.2);
      this.cave.wormsLeft = this.cave.wormQuantity;
      this.cave.goldChance = 0.4;
      this.cave.blocksLeft =
        this.cave.size * this.cave.size - this.cave.wormsLeft;
    }
    const firstBlock = this.cave.blockMatrix[startPos.x]![startPos.y]!;
    firstBlock.starter = true;
    this.breakBlock(firstBlock);
    this.getSurrBlocks(firstBlock.gridPos).forEach((block) => {
      block.starter = true;
    });
    this.placeGold();
    this.placeExit();
    if (this.cave.hasShop) {
      this.placeShop();
    }
    this.placeWorms();
    if (this.cave.hasWater) {
      this.placeFountain();
    }
    if ((gameState.level.depth + 1) % 3 == 0) {
      this.placeChest();
    }
    this.breakSurrBlocks(firstBlock.gridPos);
    this.cave.started = true;
  }

  /**
   * Renders all blocks in the cave
   */
  render = () => {
    const blockSize = 16 * this.cave.levelScale;
    for (let i = 0; i < this.cave.size; i++) {
      for (let j = 0; j < this.cave.size; j++) {
        const blockPos = new Position(i * blockSize, j * blockSize).add(
          this.pos,
        );
        const block = this.cave.blockMatrix[i]![j]!;
        // Renders all block as hidden when game hasn't started
        if (!this.cave.started) {
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
        if (block.hasChest && !block.hidden && !block.broken) {
          canvasManager.renderAnimationFrame(
            sprites.block_sheet,
            blockPos,
            16,
            16,
            8,
            1,
            0,
            0.5,
            new Position(0, 3),
            true,
            blockSize,
            blockSize,
          );
        } else {
          canvasManager.renderSpriteFromSheet(
            sprites.block_sheet,
            blockPos,
            blockSize,
            blockSize,
            block.sheetBlockPos,
            16,
            16,
          );
        }

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
          this.cave.bellRang &&
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
      this.startCave(block.gridPos);
      if (!gameState.started) {
        soundManager.playMusic(musicTracks.music);
        gameState.started = true;
        gameState.gameTimer.start();
      }
      return;
    }

    if (button == CLICKLEFT) {
      if (gameState.holding?.name == "bomb") {
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
        (!block.hidden || playerInventory.hasItem("dark_crystal")) &&
        !block.marked
      ) {
        // Regular block break
        let breakResult = this.breakBlock(block);
        enemyCount += breakResult.battle.enemyCount;
        gameState.gold += breakResult.gold;

        if (breakResult.gold > 0) {
          soundManager.playSound(sounds.gold);
        }
        if (playerInventory.hasItem("drill") && block.threatLevel == 0) {
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
            gameState.gameTimer.addSecs(-5);
            break;
          case CONTENTBLOOD:
            gameState.gameTimer.addSecs(30);
            gameState.health--;
            this.playDamageOverlay();
            soundManager.playSound(sounds.bite);
            if (gameState.health <= 0) {
              return new LoseGame();
            }
            break;
          case CONTENTEMPTY:
            if (
              playerInventory.hasItem("detonator") &&
              block.threatLevel > 0 &&
              block.threatLevel == block.markerLevel
            ) {
              let breakResult = this.breakSurrBlocks(block.gridPos);
              soundManager.playSound(sounds.detonate);
              if (playerInventory.hasItem("drill")) {
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
        return new StartBattle(enemyCount, block.hasChest);
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
    if (gameState.holding?.name == "bomb") {
      this.bomb = {
        hoverScreenPos: cursorPos,
        screenPos: new Position(cursorPos),
        timer: new Timer({}),
      };
    }
    if (block.broken) {
      if (block.content == CONTENTWATER) {
        return new ChangeCursorState(CURSORWATER);
      }
      if (block.content == CONTENTBLOOD) {
        return new ChangeCursorState(CURSORBLOOD);
      }
      if (
        playerInventory.hasItem("detonator") &&
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
