import CanvasManager from "../canvasManager.js";
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
  CONTENTWORM,
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
import {
  CURSORARROW,
  CURSORDEFAULT,
  CURSORDETONATOR,
  CURSORNONE,
  CURSORPICAXE,
  CURSORBATTLE,
} from "../cursor.js";
import { handleMouseClick, handleMouseHover } from "../updateGame.js";
import { sprites } from "../sprite.js";
import { Armor } from "../items/armor.js";
import { Shield } from "../items/shield.js";
import { Weapon } from "../items/weapon.js";
import { Consumable } from "../items/consumable.js";
import timeTracker from "../timeTracker.js";
import { Timer } from "../timer.js";
import { timerQueue } from "../timerQueue.js";
import { Battle } from "./battle.js";
import { utils } from "../utils.js";

const transitionObject = new GameObject({
  sprite: sprites.scene_transition,
  height: 128,
  width: 128,
  pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
});

transitionObject.render = (canvasManager: CanvasManager) => {
  if (transitionObject.hidden) {
    return;
  }
  canvasManager.renderAnimationFrame(
    transitionObject.sprite,
    transitionObject.pos,
    transitionObject.width,
    transitionObject.height,
    4,
    4,
    transitionObject.birthTic,
    timeTracker.currentGameTic,
    1,
    new Position(),
    false
  );
};

transitionObject.hidden = true;

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
        const blockPos = new Position(i * blockSize, j * blockSize).addPos(
          this.pos
        );
        const block = this.gameState.level.cave.blockMatrix[i]![j]!;
        if (!this.gameState.level.cave.started) {
          canvasManager.renderSpriteFromSheet(
            blockSheet,
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
          blockSheet,
          blockPos,
          blockSize,
          blockSize,
          block.sheetBlockPos,
          16,
          16
        );
        if ((block.broken && block.content != CONTENTEMPTY) || block.marked) {
          canvasManager.renderSpriteFromSheet(
            blockSheet,
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
            blockSheet,
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
  }

  renderShop(canvasManager: CanvasManager) {
    canvasManager.renderSprite(
      sprites.bg_shop,
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

  renderBattle(canvasManager: CanvasManager) {
    const inventory = this.gameState.inventory;
    canvasManager.renderSprite(
      sprites.bg_battle,
      new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT,
      GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM
    );
    canvasManager.renderSprite(
      inventory.shield.bigSprite,
      new Position(BORDERTHICKLEFT + 24, BORDERTHICKTOP + 45),
      128,
      128
    );
    canvasManager.renderSprite(
      inventory.weapon.bigSprite,
      new Position(BORDERTHICKLEFT - 24, BORDERTHICKTOP + 45),
      128,
      128
    );
    this.gameState.battle?.enemies.forEach((enemy) => {
      canvasManager.renderSpriteFromSheet(
        sprites.enemy_worm,
        enemy.pos,
        64,
        64,
        new Position()
      );
      for (let i = 0; i < enemy.health; i++) {
        canvasManager.renderSpriteFromSheet(
          sprites.icon_sheet,
          enemy.pos.add(33 + i * 9 - (9 * enemy.health) / 2, 64),
          8,
          8,
          new Position(5, 0)
        );
      }
      canvasManager.renderSpriteFromSheet(
        sprites.icon_sheet,
        enemy.pos.add(25, 8),
        8,
        8,
        new Position(3, 1)
      );
      canvasManager.renderText(
        "numbers_gray",
        enemy.pos.add(18, 8),
        enemy.damage.toString()
      );
      let counterFrame = Math.floor(
        Math.min(15, (enemy.cooldownTimer.percentage / 100) * 16)
      );
      canvasManager.renderSpriteFromSheet(
        sprites.counter_sheet,
        enemy.pos.add(34, 8),
        8,
        8,
        new Position(counterFrame % 8, Math.floor(counterFrame / 8))
      );
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
        this.renderBattle(canvasManager);
        break;
    }
    transitionObject.render(canvasManager);
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
  }

  handleMouseHoverBattle() {
    return new ChangeCursorState(CURSORBATTLE);
  }

  handleHover(cursorPos: Position) {
    if (this.gameState.inTransition) {
      return new ChangeCursorState(CURSORNONE);
    }
    switch (this.gameState.currentScene) {
      case "cave":
        return this.handleMouseHoverCave(cursorPos);
      case "shop":
        return handleMouseHover(this.gameState.level.shop!.objects);
      case "battle":
        return this.handleMouseHoverBattle();
        break;
    }
  }

  checkCaveClear() {
    if (this.gameState.level.cave.checkClear()) {
      this.gameState.gold += 5;
      this.gameState.timer.addSecs(5);
    }
  }

  screenTransition(transitionFunc: Function, delay: number = 0) {
    this.gameState.inTransition = true;
    const delayTimer = new Timer(delay, () => {
      transitionObject.hidden = false;
      transitionObject.resetAnimation();
      const transitionFuncTimer = new Timer(
        8 / timeTracker.ticsPerSecond,
        transitionFunc
      );
      const transitionEndTimer = new Timer(
        16 / timeTracker.ticsPerSecond,
        () => {
          this.gameState.inTransition = false;
        }
      );
      timerQueue.push(transitionFuncTimer, transitionEndTimer);
      transitionFuncTimer.start();
      transitionEndTimer.start();
    });
    timerQueue.push(delayTimer);
    delayTimer.start();
  }

  handleClickCave(
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) {
    const block = this.getBlockFromGamePos(cursorPos);
    if (!this.gameState.level.cave.started) {
      this.gameState.level.cave.start(
        block.gridPos,
        this.gameState.passiveItemNames
      );
      this.gameState.timer.start();
      return;
    }

    if (button == CLICKLEFT) {
      if (
        !block.broken &&
        (!block.hidden || this.gameState.hasItem("dark_crystal")) &&
        !block.marked
      ) {
        this.gameState.level.cave.breakBlock(block);
        this.checkCaveClear();
        if (block.hasGold) {
          this.gameState.gold++;
        }
        if (block.content == CONTENTWORM) {
          this.screenTransition(() => {
            this.gameState.battle = new Battle();
            this.gameState.currentScene = "battle";
          }, 0.5);
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
            this.screenTransition(() => {
              this.gameState.level = this.gameState.level.nextLevel();
              this.gameState.timer.addSecs(60);
              this.gameState.level.cave.start(
                block.gridPos,
                this.gameState.passiveItemNames
              );
            });
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
        this.checkCaveClear();
      }
    }
  }

  handleClick(
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) {
    if (this.gameState.inTransition) {
      return;
    }
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
      this.screenTransition(() => {
        this.gameState.timer.pause();
        this.gameState.currentScene = action.newScene;
      });
    } else if (action instanceof BuyShopItem) {
      if (action.shopItem.cost > this.gameState.gold) {
        return;
      }
      this.gameState.gold -= action.shopItem.cost;
      const item = action.shopItem.item;
      const inventory = this.gameState.inventory;
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
