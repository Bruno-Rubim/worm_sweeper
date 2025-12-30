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
  CLICKLEFT,
  CLICKRIGHT,
} from "../global.js";
import {
  BuyShopItem,
  ChangeCursorState,
  ChangeScene,
} from "../objectAction.js";
import { CURSORDETONATOR, CURSORPICAXE } from "../cursor.js";
import { handleMouseClick, handleMouseHover } from "../updateGame.js";
import { sprites } from "../sprite.js";
import { Armor, armorDic } from "../items/armor.js";
import { Shield } from "../items/shield.js";
import { Weapon } from "../items/weapon.js";
import { Consumable } from "../items/consumable.js";

const shopBgSprite = sprites.bg_shop;

export class LevelManager extends GameObject {
  gameState: GameState;

  constructor(gameState: GameState) {
    super({
      pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      sprite: sprites.transparent_pixel,
      width: 128,
      height: 128,
    });
    this.gameState = gameState;
    this.hoverFunction = (cursorPos: Position) => {
      return this.handleHover(cursorPos);
    };
    this.clickFunction = (
      cursorPos: Position,
      button: typeof CLICKRIGHT | typeof CLICKLEFT
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
      if (!obj.hidden) {
        obj.render(canvasManager);
      }
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

  handleMouseHoverCave(cursorPos: Position) {
    const block = this.getBlockFromGamePos(cursorPos);
    if (
      block.broken &&
      this.gameState.hasItem("detonator") &&
      block.threatLevel > 0 &&
      block.threatLevel == block.markerLevel
    ) {
      return new ChangeCursorState(CURSORDETONATOR);
    }
    return new ChangeCursorState(CURSORPICAXE);
  }

  handleHover(cursorPos: Position) {
    switch (this.gameState.currentScene) {
      case "cave":
        return this.handleMouseHoverCave(cursorPos);
      case "shop":
        return handleMouseHover(this.gameState.level.shop!.objects);
      case "battle":
        break;
    }
  }

  handleClickCave(
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) {
    const block = this.getBlockFromGamePos(cursorPos);
    if (!this.gameState.level.cave.started) {
      this.gameState.level.cave.start(
        block.gridPos,
        this.gameState.hasItem("drill")
      );
      return;
    }
    if (button == CLICKLEFT) {
      if (
        !block.broken &&
        (!block.hidden || this.gameState.hasItem("dark_crystal")) &&
        !block.marked
      ) {
        this.gameState.level.cave.breakBlock(block);
        if (this.gameState.hasItem("drill") && block.threatLevel == 0) {
          this.gameState.level.cave.breakConnectedEmpty(block);
        }
      } else if (block.broken) {
        switch (block.content) {
          case CONTENTDOOREXIT:
            block.content = CONTENTDOOREXITOPEN;
            break;
          case CONTENTDOOREXITOPEN:
            this.gameState.time += 60;
            this.gameState.level = this.gameState.level.nextLevel();
            this.gameState.level.cave.start(
              block.gridPos,
              this.gameState.hasItem("drill")
            );
            break;
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
              this.gameState.level.cave.breakSurrBlocks(block.gridPos);
              if (this.gameState.hasItem("drill")) {
                this.gameState.level.cave.breakConnectedEmpty(block);
              }
            }
            break;
        }
      }
    } else {
      if (!block.broken) {
        this.gameState.level.cave.markBlock(block);
      }
    }
  }

  handleClick(
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) {
    let action;
    switch (this.gameState.currentScene) {
      case "cave":
        action = this.handleClickCave(cursorPos, button);
        break;
      case "shop":
        action = handleMouseClick(this.gameState.level.shop!.objects);
        break;
      case "battle":
        break;
    }
    if (action instanceof ChangeScene) {
      this.gameState.currentScene = action.newScene;
    } else if (action instanceof BuyShopItem) {
      const inventory = this.gameState.inventory;
      const item = action.shopItem.item;
      if (item instanceof Armor) {
        inventory.armor = item;
        action.shopItem.hidden = true;
      } else if (item instanceof Shield) {
        inventory.shield = item;
        action.shopItem.hidden = true;
      } else if (item instanceof Weapon) {
        inventory.weapon = item;
        action.shopItem.hidden = true;
      } else if (item instanceof Consumable) {
        inventory.consumable = item;
        action.shopItem.hidden = true;
      } else {
        if (inventory.passive_1.name == "empty") {
          item.pos.update(4, 18 * 1);
          inventory.passive_1 = item;
          action.shopItem.hidden = true;
        } else if (inventory.passive_2.name == "empty") {
          item.pos.update(4, 18 * 2);
          inventory.passive_2 = item;
          action.shopItem.hidden = true;
        } else if (inventory.passive_3.name == "empty") {
          item.pos.update(4, 18 * 3);
          inventory.passive_3 = item;
          action.shopItem.hidden = true;
        } else if (inventory.passive_4.name == "empty") {
          item.pos.update(4, 18 * 4);
          inventory.passive_4 = item;
          action.shopItem.hidden = true;
        } else if (inventory.passive_5.name == "empty") {
          item.pos.update(4, 18 * 5);
          inventory.passive_5 = item;
          action.shopItem.hidden = true;
        } else if (inventory.passive_6.name == "empty") {
          item.pos.update(4, 18 * 6);
          inventory.passive_6 = item;
          action.shopItem.hidden = true;
        }
      }
    }
  }
}
