import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";
import {
  blockSheet,
  blockSheetPos,
  CONTENTDOOREXIT,
  CONTENTDOOREXITOPEN,
  CONTENTDOORSHOP,
  CONTENTDOORSHOPOPEN,
  CONTENTEMPTY,
} from "./block.js";
import type GameState from "../gameState.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, LEFT, RIGHT } from "../global.js";
import { ChangeCursorState } from "../objectAction.js";
import { PICAXE } from "../cursor.js";

export class LevelManager extends GameObject {
  gameState: GameState;

  constructor(gameState: GameState) {
    super({
      pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      spriteName: "transparent_pixel",
      width: 128,
      height: 128,
    });
    this.gameState = gameState;
    this.hoverFunction = (cursorPos: Position) => {
      return this.handleHover(cursorPos);
    };
    this.clickFunction = (
      cursorPos: Position,
      button: typeof RIGHT | typeof LEFT
    ) => {
      return this.handleClick(cursorPos, button);
    };
  }

  renderCave(canvasManager: CanvasManager) {
    const blockSize = 16 * this.gameState.level.cave.levelScale;
    for (let i = 0; i < this.gameState.level.cave.size; i++) {
      for (let j = 0; j < this.gameState.level.cave.size; j++) {
        if (!this.gameState.level.cave.started) {
          canvasManager.renderSpriteFromSheet(
            blockSheet,
            new Position(i * blockSize, j * blockSize).addPos(this.pos),
            blockSize,
            blockSize,
            blockSheetPos.hidden,
            16,
            16
          );
          continue;
        }
        const block = this.gameState.level.cave.blockMatrix[i]![j]!;
        canvasManager.renderSpriteFromSheet(
          blockSheet,
          new Position(i * blockSize, j * blockSize).addPos(this.pos),
          blockSize,
          blockSize,
          block.sheetBlockPos,
          16,
          16
        );
        if ((block.broken && block.content != CONTENTEMPTY) || block.marked) {
          canvasManager.renderSpriteFromSheet(
            blockSheet,
            new Position(i * blockSize, j * blockSize).addPos(this.pos),
            blockSize,
            blockSize,
            block.sheetContentPos,
            16,
            16
          );
        }
      }
    }
  }

  render(canvasManager: CanvasManager): void {
    this.renderCave(canvasManager);
  }

  getBlockFromGamePos(pos: Position) {
    const blockPos = pos
      .subtractPos(this.pos)
      .divide(this.gameState.level.cave.levelScale * 16);
    return this.gameState.level.cave.blockMatrix[blockPos.x]![blockPos.y]!;
  }

  handleHover(cursorPos: Position) {
    return new ChangeCursorState(PICAXE);
  }

  handleClick(cursorPos: Position, button: typeof RIGHT | typeof LEFT) {
    const block = this.getBlockFromGamePos(cursorPos);
    if (!this.gameState.level.cave.started) {
      this.gameState.level.cave.start(block.gridPos);
      return;
    }
    if (button == LEFT) {
      if (!block.broken && !block.hidden && !block.marked) {
        this.gameState.level.cave.breakBlock(block);
      } else {
        switch (block.content) {
          case CONTENTDOOREXIT:
            block.content = CONTENTDOOREXITOPEN;
            break;
          case CONTENTDOOREXITOPEN:
            this.gameState.time += 60;
            this.gameState.level = this.gameState.level.nextLevel();
            this.gameState.level.cave.start(block.gridPos);
            break;
          case CONTENTDOORSHOP:
            block.content = CONTENTDOORSHOPOPEN;
            break;
        }
      }
    } else {
      if (!block.broken) {
        this.gameState.level.cave.markBlock(block);
      }
    }
  }
}
