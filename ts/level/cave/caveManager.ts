import {
  Action,
  ChangeCursorState,
  ChangeScene,
  NextLevel,
  StartBattle,
} from "../../action.js";
import type CanvasManager from "../../canvasManager.js";
import {
  CURSORARROW,
  CURSORDEFAULT,
  CURSORDETONATOR,
  CURSORGOLDWATER,
  CURSORPICAXE,
} from "../../cursor.js";
import type GameState from "../../gameState.js";
import { CLICKLEFT, type CLICKRIGHT } from "../../global.js";
import Bomb from "../../items/consumable/bomb.js";
import { Chisel } from "../../items/passives/chisel.js";
import Position from "../../position.js";
import type { SoundManager } from "../../soundManager.js";
import sounds from "../../sounds.js";
import { sprites } from "../../sprites.js";
import { Timer } from "../../timer/timer.js";
import { timerQueue } from "../../timer/timerQueue.js";
import {
  blockSheetPos,
  CONTENTDOOREXIT,
  CONTENTDOOREXITOPEN,
  CONTENTDOORSHOP,
  CONTENTDOORSHOPOPEN,
  CONTENTEMPTY,
  CONTENTWATER,
} from "./block.js";
import SceneManager from "../sceneManager.js";

// Handles rendering and interactions with the cave scene of the current Level
export default class CaveManager extends SceneManager {
  activeChisel: null | { screenPos: Position; timer: Timer; chisel: Chisel } =
    null;
  bomb: null | {
    screenPos: Position;
    timer: Timer;
    hoverScreenPos: Position | null;
  } = null;

  constructor(
    gameState: GameState,
    scenePos: Position,
    soundManager: SoundManager
  ) {
    super(gameState, scenePos, soundManager);
  }

  /**
   * Returns a block that matches the position in relation to the screen
   * @param pos
   * @returns
   */
  getBlockFromScrenPos(pos: Position) {
    const blockPos = pos
      .subtract(this.pos)
      .divide(this.gameState.level.cave.levelScale * 16);
    return this.gameState.level.cave.blockMatrix[blockPos.x]![blockPos.y]!;
  }

  /**
   * Checks if the cave has been cleared (all worms marked and all blocks broken)
   */
  checkCaveClear() {
    if (this.gameState.level.cave.checkClear()) {
      if (this.gameState.hasItem("health_insurance")) {
        this.gameState.health++;
      }
      this.gameState.gold += 5;
      if (this.gameState.hasItem("gold_bug")) {
        this.gameState.gold += 5;
      }

      this.soundManager.playSound(sounds.clear);
    }
  }

  /**
   * Renders all blocks in the cave
   * @param canvasManager
   */
  render = (canvasManager: CanvasManager) => {
    const blockSize = 16 * this.gameState.level.cave.levelScale;
    for (let i = 0; i < this.gameState.level.cave.size; i++) {
      for (let j = 0; j < this.gameState.level.cave.size; j++) {
        const blockPos = new Position(i * blockSize, j * blockSize).add(
          this.pos
        );
        const block = this.gameState.level.cave.blockMatrix[i]![j]!;
        // Renders all block as hidden when game hasn't started
        if (!this.gameState.level.cave.started) {
          canvasManager.renderSpriteFromSheet(
            sprites.block_sheet,
            blockPos,
            blockSize,
            blockSize,
            blockSheetPos.hidden,
            16,
            16
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
          16
        );

        //Renders content
        if ((block.broken && block.content != CONTENTEMPTY) || block.marked) {
          canvasManager.renderSpriteFromSheet(
            sprites.block_sheet,
            blockPos,
            blockSize,
            blockSize,
            block.sheetContentPos.add(
              0,
              block.marked && this.gameState.holding instanceof Chisel ? 1 : 0
            ),
            16,
            16
          );
        }

        //Renders bell
        if (
          this.gameState.level.cave.bellRang &&
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
            16
          );
        }
      }
    }
    // Renders Bomb
    if (this.bomb) {
      const block = this.getBlockFromScrenPos(this.bomb.screenPos);
      const blockPos = new Position(
        block.gridPos.x * blockSize,
        block.gridPos.y * blockSize
      ).add(this.pos);
      let framePos = new Position();
      if (!this.bomb.hoverScreenPos) {
        framePos = new Position(
          Math.min(
            2,
            Math.floor(this.bomb.timer.percentageLeft / ((1 / 3) * 100))
          ) + 1,
          0
        );
      }
      canvasManager.renderSpriteFromSheet(
        sprites.bomb_sheet,
        blockPos,
        blockSize,
        blockSize,
        framePos,
        16,
        16
      );
    }

    // Renders chisel
    if (this.activeChisel) {
      let posShift = new Position(-blockSize / 2, blockSize / 2);
      let framePos = new Position();
      const block = this.getBlockFromScrenPos(this.activeChisel.screenPos);
      const blockPos = new Position(
        block.gridPos.x * blockSize,
        block.gridPos.y * blockSize
      ).add(this.pos);

      const caveSize = this.gameState.level.cave.size;
      if (block.gridPos.x - 1 < caveSize / 2) {
        posShift = posShift.add(blockSize, 0);
        framePos = framePos.add(2, 0);
      }
      if (block.gridPos.y + 1 > caveSize / 2) {
        posShift = posShift.add(0, -blockSize);
        framePos = framePos.add(0, 1);
      }

      canvasManager.renderSpriteFromSheet(
        sprites.chisel_sheet,
        blockPos.add(posShift),
        blockSize,
        blockSize,
        framePos.add(
          Math.floor(this.activeChisel.timer.percentageLeft / (100 / 6)) % 2,
          0
        ),
        16,
        16
      );
    }
  };

  // TO-DO: make a handleAction function for this element instead of leaving it all for the handleClick
  handleClick = (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => {
    const block = this.getBlockFromScrenPos(cursorPos);
    if (!this.gameState.level.cave.started) {
      // Start game
      this.gameState.level.cave.start(block.gridPos, this.gameState.itemNames);
      this.gameState.gameTimer.start();
      this.soundManager.playSound(sounds.break);
      if (!this.gameState.started) {
        // this.soundManager.playMusic(music.drums);
        this.gameState.started = true;
      }
      return;
    }

    if (button == CLICKLEFT) {
      if (this.gameState.holding instanceof Bomb) {
        // Bomb functionality
        if (block.broken && block.content != CONTENTEMPTY) {
          return;
        }
        this.bomb = {
          screenPos: new Position(cursorPos),
          timer: new Timer({
            goalSecs: 1.9,
            goalFunc: () => {
              this.gameState.level.cave.bomb(block);
              this.soundManager.playSound(sounds.break);
              this.soundManager.playSound(sounds.break);
              this.soundManager.playSound(sounds.break);
              this.soundManager.playSound(sounds.break);
              this.checkCaveClear();
              this.bomb = null;
              this.soundManager.playSound(sounds.explosion);
            },
          }),
          hoverScreenPos: null,
        };
        this.bomb.timer.start();
        this.soundManager.playSound(sounds.bomb_fuse);
        this.gameState.holding = null;
        return;
      } else if (
        this.gameState.holding instanceof Chisel &&
        !this.gameState.holding.chiselTimer.inMotion
      ) {
        // Chisel functionality
        if (block.hasGold && !block.hidden && !block.broken) {
          const chisel = this.gameState.holding;
          chisel.chiselTimer.goalFunc = () => {
            this.gameState.gold += 1;
            chisel.using = false;
            this.soundManager.playSound(sounds.gold);
            block.hasGold = false;
            this.activeChisel = null;
          };
          this.activeChisel = {
            screenPos: new Position(cursorPos),
            timer: chisel.chiselTimer,
            chisel: chisel,
          };
          chisel.chiselTimer.start();
          this.gameState.holding = null;
        }
        return;
      }
      let enemyCount = 0;
      if (
        !block.broken &&
        (!block.hidden || this.gameState.hasItem("dark_crystal")) &&
        !block.marked
      ) {
        // Regular block break
        this.soundManager.playSound(sounds.break);
        if (
          this.activeChisel &&
          block == this.getBlockFromScrenPos(this.activeChisel.screenPos)
        ) {
          this.activeChisel.timer.goalFunc = () => {};
          timerQueue.splice(timerQueue.indexOf(this.activeChisel.timer), 1);
          this.activeChisel.chisel.using = false;
          this.activeChisel.chisel.chiselTimer.restart();
          this.activeChisel = null;
        }
        let breakResult = this.gameState.level.cave.breakBlock(block);
        enemyCount += breakResult.battle.enemyCount;
        this.gameState.gold += breakResult.gold;

        if (breakResult.gold > 0) {
          this.soundManager.playSound(sounds.gold);
        }
        if (this.gameState.hasItem("drill") && block.threatLevel == 0) {
          this.soundManager.playSound(sounds.drill);
          this.gameState.level.cave.breakConnectedEmpty(block);
        }
      } else if (block.broken) {
        switch (block.content) {
          case CONTENTDOOREXIT:
            this.soundManager.playSound(sounds.door);
            block.content = CONTENTDOOREXITOPEN;
            break;
          case CONTENTDOOREXITOPEN:
            this.soundManager.playSound(sounds.steps);
            return new NextLevel(block.gridPos);
          case CONTENTDOORSHOP:
            this.soundManager.playSound(sounds.door);
            block.content = CONTENTDOORSHOPOPEN;
            break;
          case CONTENTDOORSHOPOPEN:
            this.soundManager.playSound(sounds.steps);
            return new ChangeScene("shop");
          case CONTENTWATER:
            // this.soundManager.playSound(); TO-DO: water sfx
            this.gameState.gold += 1;
            this.soundManager.playSound(sounds.gold);
            this.gameState.gameTimer.addSecs(-10);
            break;
          case CONTENTEMPTY:
            if (
              this.gameState.hasItem("detonator") &&
              block.threatLevel > 0 &&
              block.threatLevel == block.markerLevel
            ) {
              let breakResult = this.gameState.level.cave.breakSurrBlocks(
                block.gridPos
              );
              this.soundManager.playSound(sounds.detonate);
              if (this.gameState.hasItem("drill")) {
                this.gameState.level.cave.breakConnectedEmpty(block);
              }
              enemyCount += breakResult.battle.enemyCount;
              if (breakResult.gold > 0) {
                this.soundManager.playSound(sounds.gold);
              }
              this.gameState.gold += breakResult.gold;
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
        this.gameState.level.cave.markBlock(block);
        this.checkCaveClear();
      }
    }
  };

  handleHover = (cursorPos: Position) => {
    this.gameState.level.cave.allBLocks.forEach((block) => {
      block.cursorHovering = false;
    });
    const block = this.getBlockFromScrenPos(cursorPos);
    block.cursorHovering = true;
    if (this.gameState.holding instanceof Bomb) {
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
        this.gameState.hasItem("detonator") &&
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
