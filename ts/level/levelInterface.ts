import type CanvasManager from "../canvasManager.js";
import { findSprite } from "../sprites/findSprite.js";
import GameObject from "../gameObject.js";
import Level from "./level.js";
import Position from "../position.js";
import { LEFT, type RIGHT } from "../directions.js";
import {
  DOOREXIT,
  DOOREXITOPEN,
  DOORSHOP,
  DOORSHOPOPEN,
  EMPTY,
  WORM,
} from "./block.js";

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

export class levelInterface extends GameObject {
  level: Level;

  constructor(level: Level) {
    super({
      pos: new Position(20, 20),
      spriteName: "transparent_pixel",
      width: 128,
      height: 128,
    });
    this.level = level;
    this.clickFunction = (
      cursorPos: Position,
      button: typeof RIGHT | typeof LEFT
    ) => {
      return this.handleClick(cursorPos, button);
    };
  }

  render(canvasManager: CanvasManager): void {
    for (let i = 0; i < this.level.size; i++) {
      for (let j = 0; j < this.level.size; j++) {
        if (!this.level.started) {
          canvasManager.renderSpriteFromSheet(
            blockSheet,
            new Position(
              i * 16 * this.level.levelScale + 20,
              j * 16 * this.level.levelScale + 20
            ),
            16 * this.level.levelScale,
            16 * this.level.levelScale,
            new Position(0, 0),
            16,
            16
          );
        }
        const block = this.level.blockMatrix[i]![j]!;
        canvasManager.renderSpriteFromSheet(
          blockSheet,
          new Position(
            i * 16 * this.level.levelScale + 20,
            j * 16 * this.level.levelScale + 20
          ),
          16 * this.level.levelScale,
          16 * this.level.levelScale,
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
              i * 16 * this.level.levelScale + 20,
              j * 16 * this.level.levelScale + 20
            ),
            16 * this.level.levelScale,
            16 * this.level.levelScale,
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
      .subtract(20, 20)
      .divide(this.level.levelScale * 16);
    if (!this.level.started) {
      this.level.start(blockPos);
      return;
    }
    const block = this.level.blockMatrix[blockPos.x]![blockPos.y]!;
    if (button == LEFT) {
      if (!block.broken) {
        this.level.breakBlock(block);
      } else {
        switch (block.content) {
          case DOOREXIT:
            block.content = DOOREXITOPEN;
            break;
          case DOOREXITOPEN:
            this.level = this.level.nextLevel();
            this.level.start(blockPos);
            break;
          case DOORSHOP:
            block.content = DOORSHOPOPEN;
            break;
        }
      }
    }
  }
}
