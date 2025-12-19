import type CanvasManager from "../canvasManager.js";
import { findSprite } from "../sprites/findSprite.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";
import {
  DOOREXIT,
  DOOREXITOPEN,
  DOORSHOP,
  DOORSHOPOPEN,
  EMPTY,
  WORM,
} from "./block.js";
import type GameState from "../gameState.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, LEFT, RIGHT } from "../global.js";

const blockSheet = findSprite("block_sheet");
const contentSheet = findSprite("content_sheet");

const contentToSheetPos = {
  [DOOREXIT]: new Position(0, 0),
  [DOOREXITOPEN]: new Position(1, 0),
  [DOORSHOP]: new Position(2, 0),
  [DOORSHOPOPEN]: new Position(3, 0),
  [WORM]: new Position(4, 0),
  [EMPTY]: new Position(0, 1),
};

export class LevelInterface extends GameObject {
  gameState: GameState;

  constructor(gameState: GameState) {
    super({
      pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      spriteName: "transparent_pixel",
      width: 128,
      height: 128,
    });
    this.gameState = gameState;
    this.clickFunction = (
      cursorPos: Position,
      button: typeof RIGHT | typeof LEFT
    ) => {
      return this.handleClick(cursorPos, button);
    };
  }

  render(canvasManager: CanvasManager): void {
    for (let i = 0; i < this.gameState.level.size; i++) {
      for (let j = 0; j < this.gameState.level.size; j++) {
        if (!this.gameState.level.started) {
          canvasManager.renderSpriteFromSheet(
            blockSheet,
            new Position(
              i * 16 * this.gameState.level.levelScale,
              j * 16 * this.gameState.level.levelScale
            ).addPos(this.pos),
            16 * this.gameState.level.levelScale,
            16 * this.gameState.level.levelScale,
            new Position(0, 0),
            16,
            16
          );
        }
        const block = this.gameState.level.blockMatrix[i]![j]!;
        canvasManager.renderSpriteFromSheet(
          blockSheet,
          new Position(
            i * 16 * this.gameState.level.levelScale,
            j * 16 * this.gameState.level.levelScale
          ).addPos(this.pos),
          16 * this.gameState.level.levelScale,
          16 * this.gameState.level.levelScale,
          block!.sheetPos,
          16,
          16
        );
        if (block.broken) {
          let sheetPos = contentToSheetPos[block.content];
          if (block.content == EMPTY) {
            sheetPos.x = block.threatLevel;
          }
          canvasManager.renderSpriteFromSheet(
            contentSheet,
            new Position(
              i * 16 * this.gameState.level.levelScale,
              j * 16 * this.gameState.level.levelScale
            ).addPos(this.pos),
            16 * this.gameState.level.levelScale,
            16 * this.gameState.level.levelScale,
            sheetPos,
            16,
            16
          );
        }
      }
    }
  }

  handleClick(cursorPos: Position, button: typeof RIGHT | typeof LEFT) {
    const blockPos = cursorPos
      .subtractPos(this.pos)
      .divide(this.gameState.level.levelScale * 16);
    if (!this.gameState.level.started) {
      this.gameState.level.start(blockPos);
      return;
    }
    const block = this.gameState.level.blockMatrix[blockPos.x]![blockPos.y]!;
    if (button == LEFT) {
      if (!block.broken) {
        this.gameState.level.breakBlock(block);
      } else {
        switch (block.content) {
          case DOOREXIT:
            block.content = DOOREXITOPEN;
            break;
          case DOOREXITOPEN:
            this.gameState.time += 60;
            this.gameState.level = this.gameState.level.nextLevel();
            this.gameState.level.start(blockPos);
            break;
          case DOORSHOP:
            block.content = DOORSHOPOPEN;
            break;
        }
      }
    }
  }
}
