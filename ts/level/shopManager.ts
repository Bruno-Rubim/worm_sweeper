import { BuyShopItem, type Action } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import type GameState from "../gameState.js";
import {
  BORDERTHICKBOTTOM,
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  GAMEHEIGHT,
  GAMEWIDTH,
} from "../global.js";
import { Armor } from "../items/armor.js";
import { Consumable } from "../items/consumable.js";
import { Shield } from "../items/shield.js";
import { Weapon } from "../items/weapon.js";
import Position from "../position.js";
import type { SoundManager } from "../soundManager.js";
import { sprites } from "../sprites.js";
import { handleMouseClick, handleMouseHover } from "../updateGame.js";
import SceneManager from "./sceneManager.js";

// Handles rendering and interactions with the shop scene of the current level
export default class ShopManager extends SceneManager {
  constructor(
    gameState: GameState,
    scenePos: Position,
    soundManager: SoundManager
  ) {
    super(gameState, scenePos, soundManager);
  }

  /**
   * Renders the shop's background and all its objects (shopItems and the exit sign)
   * @param canvasManager
   */
  render = (canvasManager: CanvasManager) => {
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
  };

  handleClick = () => {
    const action = handleMouseClick(this.gameState.level.shop!.objects);
    if (!action) {
      return;
    }
    if (action instanceof BuyShopItem) {
      if (action.shopItem.item.cost > this.gameState.gold) {
        return;
      }
      this.gameState.gold -= action.shopItem.item.cost;
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
        // Currently if you have 6 passive items, buying another one will just discart it, idk if that's how it should go. TO-DO: Idk think about how else it can be
      }
      return;
    }
    return action;
  };

  handleHover = (cursorPos: Position) => {
    return handleMouseHover(this.gameState.level.shop!.objects);
  };
}
