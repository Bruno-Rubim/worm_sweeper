import {
  ChangeCursorState,
  ChangeScene,
  NextLevel,
  StartBattle,
  Transition,
} from "../action.js";
import type CanvasManager from "../canvasManager.js";
import {
  CURSORARROW,
  CURSORDEFAULT,
  CURSORDETONATOR,
  CURSORPICAXE,
} from "../cursor.js";
import type GameState from "../gameState.js";
import { CLICKLEFT, type CLICKRIGHT } from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import {
  blockSheetPos,
  CONTENTBOMB,
  CONTENTDOOREXIT,
  CONTENTDOOREXITOPEN,
  CONTENTDOORSHOP,
  CONTENTDOORSHOPOPEN,
  CONTENTEMPTY,
} from "./block.js";
import SceneManager from "./sceneManager.js";

export default class CaveManager extends SceneManager {
  constructor(gameState: GameState, scenePos: Position) {
    super(gameState, scenePos);
  }
  getBlockFromGamePos(pos: Position) {
    const blockPos = pos
      .subtractPos(this.pos)
      .divide(this.gameState.level.cave.levelScale * 16);
    return this.gameState.level.cave.blockMatrix[blockPos.x]![blockPos.y]!;
  }

  checkCaveClear() {
    if (this.gameState.level.cave.checkClear()) {
      if (this.gameState.hasItem("health_insurance")) {
        this.gameState.health++;
      }
      this.gameState.gold += 5;
      this.gameState.gameTimer.addSecs(5);
    }
  }

  render = (canvasManager: CanvasManager) => {
    const blockSize = 16 * this.gameState.level.cave.levelScale;
    for (let i = 0; i < this.gameState.level.cave.size; i++) {
      for (let j = 0; j < this.gameState.level.cave.size; j++) {
        const blockPos = new Position(i * blockSize, j * blockSize).addPos(
          this.pos
        );
        const block = this.gameState.level.cave.blockMatrix[i]![j]!;
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
        canvasManager.renderSpriteFromSheet(
          sprites.block_sheet,
          blockPos,
          blockSize,
          blockSize,
          block.sheetBlockPos,
          16,
          16
        );
        if ((block.broken && block.content != CONTENTEMPTY) || block.marked) {
          canvasManager.renderSpriteFromSheet(
            sprites.block_sheet,
            blockPos,
            blockSize,
            blockSize,
            block.sheetContentPos,
            16,
            16
          );
        }
        if (
          this.gameState.hasItem("silver_bell") &&
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
  };

  handleClick = (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => {
    const block = this.getBlockFromGamePos(cursorPos);
    if (!this.gameState.level.cave.started) {
      this.gameState.level.cave.start(
        block.gridPos,
        this.gameState.passiveItemNames
      );
      this.gameState.gameTimer.start();
      return;
    }

    if (button == CLICKLEFT) {
      if (this.gameState.holdingBomb) {
        block.content = CONTENTBOMB;
        block.bombTimer = new Timer(3, () => {
          this.gameState.level.cave.bomb(block);
          this.checkCaveClear();
        });
        timerQueue.push(block.bombTimer);
        block.bombTimer.start();
        this.gameState.holdingBomb = false;
        return;
      }
      let enemyCount = 0;
      if (
        !block.broken &&
        (!block.hidden || this.gameState.hasItem("dark_crystal")) &&
        !block.marked
      ) {
        let action = this.gameState.level.cave.breakBlock(block);
        if (action instanceof StartBattle) {
          enemyCount += action.enemyCount;
        }
        if (block.hasGold) {
          this.gameState.gold++;
        }
        if (this.gameState.hasItem("drill") && block.threatLevel == 0) {
          this.gameState.level.cave.breakConnectedEmpty(block);
        }
      } else if (block.broken) {
        switch (block.content) {
          case CONTENTDOOREXIT:
            block.content = CONTENTDOOREXITOPEN;
            break;
          case CONTENTDOOREXITOPEN:
            return new NextLevel(block.gridPos);
          case CONTENTDOORSHOP:
            block.content = CONTENTDOORSHOPOPEN;
            break;
          case CONTENTDOORSHOPOPEN:
            return new ChangeScene("shop");
          case CONTENTEMPTY:
            if (
              this.gameState.hasItem("detonator") &&
              block.threatLevel > 0 &&
              block.threatLevel == block.markerLevel
            ) {
              let battle = this.gameState.level.cave.breakSurrBlocks(
                block.gridPos
              );
              enemyCount += battle.enemyCount;
              if (this.gameState.hasItem("drill")) {
                this.gameState.level.cave.breakConnectedEmpty(block);
              }
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
    const block = this.getBlockFromGamePos(cursorPos);
    if (this.gameState.holdingBomb) {
      this.gameState.level.cave.setBombOverlay(block);
    } else {
      this.gameState.level.cave.setBombOverlay();
    }
    if (
      block.broken &&
      this.gameState.hasItem("detonator") &&
      block.threatLevel > 0 &&
      block.threatLevel == block.markerLevel
    ) {
      return new ChangeCursorState(CURSORDETONATOR);
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
}
