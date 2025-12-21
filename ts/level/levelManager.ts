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
import {
  BORDERTHICKBOTTOM,
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  GAMEHEIGHT,
  GAMEWIDTH,
  LEFT,
  RIGHT,
} from "../global.js";
import {
  ChangeCursorState,
  ChangeScene,
  ObjectAction,
} from "../objectAction.js";
import { PICAXE } from "../cursor.js";
import { findSprite } from "../sprites/findSprite.js";

const shopBgSprite = findSprite("bg_shop");

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

  renderShop(canvasManager: CanvasManager) {
    canvasManager.renderSprite(
      shopBgSprite,
      new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT,
      GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM
    );
    this.gameState.level.shop?.objects.forEach((obj) => {
      obj.render(canvasManager);
    });
  }

  render(canvasManager: CanvasManager): void {
    switch (this.gameState.currentScene) {
      case "cave":
        this.renderCave(canvasManager);
        break;
      case "shop":
        this.renderShop(canvasManager);
        break;
      case "battle":
        break;
    }
  }

  getBlockFromGamePos(pos: Position) {
    const blockPos = pos
      .subtractPos(this.pos)
      .divide(this.gameState.level.cave.levelScale * 16);
    return this.gameState.level.cave.blockMatrix[blockPos.x]![blockPos.y]!;
  }

  handleHover(cursorPos: Position) {
    switch (this.gameState.currentScene) {
      case "cave":
        return new ChangeCursorState(PICAXE);
      case "shop":
        break;
      case "battle":
        break;
    }
  }

  handleClickCave(cursorPos: Position, button: typeof RIGHT | typeof LEFT) {
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
          case CONTENTDOORSHOPOPEN:
            return new ChangeScene("shop");
        }
      }
    } else {
      if (!block.broken) {
        this.gameState.level.cave.markBlock(block);
      }
    }
  }

  handleClickShop(cursorPos: Position, button: typeof RIGHT | typeof LEFT) {
    if (button == RIGHT) {
      return;
    }
    let action: ObjectAction | void | null = null;
    this.gameState.level.shop?.objects.forEach((obj) => {
      if (obj.clickFunction && obj.hitbox.positionInside(cursorPos)) {
        action = obj.clickFunction(cursorPos, button);
        console.log(action);
        return action;
      }
    });
    if (action) {
      return action;
    }
  }

  handleClick(cursorPos: Position, button: typeof RIGHT | typeof LEFT) {
    let action;
    switch (this.gameState.currentScene) {
      case "cave":
        action = this.handleClickCave(cursorPos, button);
        break;
      case "shop":
        action = this.handleClickShop(cursorPos, button);
        break;
      case "battle":
        break;
    }
    console.log(action);
    if (action instanceof ChangeScene) {
      this.gameState.currentScene = action.newScene;
    }
  }
}
