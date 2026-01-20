import { canvasManager } from "../../canvasManager.js";
import { gameState } from "../../gameState.js";
import {
  BORDERTHICKBOTTOM,
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  CENTER,
  GAMEHEIGHT,
  GAMEWIDTH,
  RIGHT,
} from "../../global.js";
import Position from "../../gameElements/position.js";
import { sprites } from "../../sprites.js";
import SceneManager from "../sceneManager.js";
import { BuyShopItem, ShopItemDescription, type Action } from "../../action.js";
import {
  handleMouseClick,
  handleMouseHover,
  handleMouseNotHover,
} from "../../input/handleInput.js";
import { soundManager } from "../../soundManager.js";
import sounds from "../../sounds.js";
import playerInventory, { getInventorySpace } from "../../playerInventory.js";
import { Armor } from "../../items/armor/armor.js";
import { Shield } from "../../items/shield/shield.js";
import { Weapon } from "../../items/weapon/weapon.js";
import { Consumable } from "../../items/consumable/consumable.js";
import { getItem } from "../../items/genericDict.js";

// Handles rendering and interactions with the shop scene of the current level
export default class ShopManager extends SceneManager {
  currentText: string = "";

  /**
   * Renders the shop's background and all its objects (shopItems and the exit sign)
   */
  render = () => {
    canvasManager.renderSprite(
      sprites.bg_shop,
      new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT,
      GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM,
    );
    gameState.level.shop.objects.forEach((obj) => {
      if (!obj.hidden) {
        obj.render();
      }
    });
    canvasManager.renderText(
      "shop_description",
      new Position(27, 95),
      this.currentText,
      RIGHT,
      120,
      0.8,
    );
    canvasManager.renderText(
      "numbers_gold",
      new Position(GAMEWIDTH - BORDERTHICKRIGHT - 12, BORDERTHICKTOP + 59),
      gameState.shopResetPrice.toString(),
      CENTER,
    );
  };

  handleAction(action: Action) {
    if (action instanceof BuyShopItem) {
      if (action.shopItem.item.cost > gameState.gold) {
        soundManager.playSound(sounds.wrong);
        return;
      }
      const item = action.shopItem.item;
      if (item instanceof Armor) {
        playerInventory.armor = item;
        action.shopItem.hidden = true;
      } else if (item instanceof Shield) {
        playerInventory.shield = item;
        action.shopItem.hidden = true;
      } else if (item instanceof Weapon) {
        playerInventory.weapon = item;
        action.shopItem.hidden = true;
      } else if (item instanceof Consumable) {
        playerInventory.consumable = item;
        action.shopItem.hidden = true;
      } else {
        if (item.name == "backpack") {
          item.pos.update(-Infinity, -Infinity);
          playerInventory.bag = item;
          playerInventory.passive_7 = getItem("empty", new Position(4, 18 * 7));
        } else if (getInventorySpace() < 1) {
          soundManager.playSound(sounds.wrong);
          return;
        } else if (playerInventory.passive_1.name == "empty") {
          item.pos.update(4, 18 * 1);
          playerInventory.passive_1 = item;
        } else if (playerInventory.passive_2.name == "empty") {
          item.pos.update(4, 18 * 2);
          playerInventory.passive_2 = item;
        } else if (playerInventory.passive_3.name == "empty") {
          item.pos.update(4, 18 * 3);
          playerInventory.passive_3 = item;
        } else if (playerInventory.passive_4.name == "empty") {
          item.pos.update(4, 18 * 4);
          playerInventory.passive_4 = item;
        } else if (playerInventory.passive_5.name == "empty") {
          item.pos.update(4, 18 * 5);
          playerInventory.passive_5 = item;
        } else if (playerInventory.passive_6.name == "empty") {
          item.pos.update(4, 18 * 6);
          playerInventory.passive_6 = item;
        } else if (playerInventory.passive_7.name == "empty") {
          item.pos.update(4, 18 * 7);
          playerInventory.passive_7 = item;
        }
      }
      action.shopItem.hidden = true;
      gameState.gold -= action.shopItem.item.cost;
      soundManager.playSound(sounds.purchase);
      return;
    }
    return action;
  }

  handleClick = () => {
    let action = handleMouseClick(gameState.level.shop!.objects);
    if (!action) {
      return;
    }
    action = this.handleAction(action);
    if (!action) {
      return;
    }
    return action;
  };

  handleHover = (cursorPos: Position) => {
    let action: Action | void = handleMouseHover(gameState.level.shop!.objects);
    if (action instanceof ShopItemDescription) {
      this.currentText = action.description;
      return;
    } else {
      this.currentText =
        "Right click one of your items to sell for some change.";
    }
    return action;
  };

  handleNotHover = () => {
    let action: Action | void = handleMouseNotHover(
      gameState.level.shop!.objects,
    );
    return action;
  };
}
