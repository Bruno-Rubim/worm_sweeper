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
import {
  Action,
  BuyShopItem,
  ObtainItem,
  ShopItemDescription,
} from "../../action.js";
import {
  handleMouseClick,
  handleMouseHover,
  handleMouseNotHover,
} from "../../input/handleInput.js";
import { soundManager } from "../../sounds/soundManager.js";
import sounds from "../../sounds/sounds.js";

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
      if (action.shopItem.item.finalCost > gameState.gold) {
        soundManager.playSound(sounds.wrong);
        return;
      }
      const item = action.shopItem.item;
      action.shopItem.hidden = true;
      gameState.gold -= action.shopItem.item.finalCost;
      soundManager.playSound(sounds.purchase);
      action.shopItem.hidden = true;
      return new ObtainItem(item);
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
      this.currentText = "";
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
