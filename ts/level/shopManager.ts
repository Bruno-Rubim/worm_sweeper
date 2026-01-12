import { Action, BuyShopItem, ShopItemDescription } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import type GameState from "../gameState.js";
import {
  BORDERTHICKBOTTOM,
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  CENTER,
  GAMEHEIGHT,
  GAMEWIDTH,
  RIGHT,
} from "../global.js";
import { Armor } from "../items/armor/armor.js";
import { Consumable } from "../items/consumable/consumable.js";
import { getItem } from "../items/passives/dict.js";
import { Shield } from "../items/shield/shield.js";
import { Weapon } from "../items/weapon/weapon.js";
import Position from "../position.js";
import type { SoundManager } from "../soundManager.js";
import sounds from "../sounds.js";
import { sprites } from "../sprites.js";
import {
  handleMouseClick,
  handleMouseHover,
  handleMouseNotHover,
} from "../updateGame.js";
import SceneManager from "./sceneManager.js";

// Handles rendering and interactions with the shop scene of the current level
export default class ShopManager extends SceneManager {
  currentText: string = "";

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
    canvasManager.renderText(
      "shop_description",
      new Position(27, 95),
      this.currentText,
      RIGHT,
      120,
      0.8
    );
    canvasManager.renderText(
      "numbers_gold",
      new Position(GAMEWIDTH - BORDERTHICKRIGHT - 12, BORDERTHICKTOP + 59),
      this.gameState.shopResetPrice.toString(),
      CENTER
    );
  };

  handleClick = () => {
    const action = handleMouseClick(this.gameState.level.shop!.objects);
    if (!action) {
      return;
    }
    if (action instanceof BuyShopItem) {
      if (action.shopItem.item.cost > this.gameState.gold) {
        this.soundManager.playSound(sounds.wrong);
        return;
      }
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
        if (item.name == "backpack") {
          item.pos.update(-Infinity, -Infinity);
          inventory.bag = item;
          inventory.passive_7 = getItem("empty", new Position(4, 18 * 7));
        } else if (this.gameState.passiveSpace < 1) {
          this.soundManager.playSound(sounds.wrong);
          return;
        } else if (inventory.passive_1.name == "empty") {
          item.pos.update(4, 18 * 1);
          inventory.passive_1 = item;
        } else if (inventory.passive_2.name == "empty") {
          item.pos.update(4, 18 * 2);
          inventory.passive_2 = item;
        } else if (inventory.passive_3.name == "empty") {
          item.pos.update(4, 18 * 3);
          inventory.passive_3 = item;
        } else if (inventory.passive_4.name == "empty") {
          item.pos.update(4, 18 * 4);
          inventory.passive_4 = item;
        } else if (inventory.passive_5.name == "empty") {
          item.pos.update(4, 18 * 5);
          inventory.passive_5 = item;
        } else if (inventory.passive_6.name == "empty") {
          item.pos.update(4, 18 * 6);
          inventory.passive_6 = item;
        } else if (inventory.passive_7.name == "empty") {
          item.pos.update(4, 18 * 7);
          inventory.passive_7 = item;
        }
      }
      action.shopItem.hidden = true;
      this.gameState.gold -= action.shopItem.item.cost;
      this.soundManager.playSound(sounds.purchase);
      return;
    }
    return action;
  };

  handleHover = (cursorPos: Position) => {
    let action: Action | void = handleMouseHover(
      this.gameState.level.shop!.objects
    );
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
      this.gameState.level.shop!.objects
    );
    return action;
  };
}
