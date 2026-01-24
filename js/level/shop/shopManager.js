import { canvasManager } from "../../canvasManager.js";
import { gameState } from "../../gameState.js";
import { BORDERTHICKBOTTOM, BORDERTHICKLEFT, BORDERTHICKRIGHT, BORDERTHICKTOP, CENTER, GAMEHEIGHT, GAMEWIDTH, RIGHT, } from "../../global.js";
import Position from "../../gameElements/position.js";
import { sprites } from "../../sprites.js";
import SceneManager from "../sceneManager.js";
import { Action, BuyShopItem, ConsumeItem, ShopItemDescription, } from "../../action.js";
import { handleMouseClick, handleMouseHover, handleMouseNotHover, } from "../../input/handleInput.js";
import { soundManager } from "../../sounds/soundManager.js";
import sounds from "../../sounds/sounds.js";
import playerInventory, { hasItem } from "../../playerInventory.js";
import { Armor } from "../../items/armor/armor.js";
import { Shield } from "../../items/shield/shield.js";
import { Weapon } from "../../items/weapon/weapon.js";
import { ActiveItem } from "../../items/active/active.js";
import { Consumable } from "../../items/consumable/consumable.js";
export default class ShopManager extends SceneManager {
    currentText = "";
    render = () => {
        canvasManager.renderSprite(sprites.bg_shop, new Position(BORDERTHICKLEFT, BORDERTHICKTOP), GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT, GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM);
        gameState.level.shop.objects.forEach((obj) => {
            if (!obj.hidden) {
                obj.render();
            }
        });
        canvasManager.renderText("shop_description", new Position(27, 95), this.currentText, RIGHT, 120, 0.8);
        canvasManager.renderText("numbers_gold", new Position(GAMEWIDTH - BORDERTHICKRIGHT - 12, BORDERTHICKTOP + 59), gameState.shopResetPrice.toString(), CENTER);
    };
    handleAction(action) {
        if (action instanceof BuyShopItem) {
            if (action.shopItem.item.cost > gameState.gold) {
                soundManager.playSound(sounds.wrong);
                return;
            }
            const item = action.shopItem.item;
            action.shopItem.hidden = true;
            gameState.gold -= action.shopItem.item.cost;
            soundManager.playSound(sounds.purchase);
            if (item instanceof Armor) {
                playerInventory.armor = item;
                action.shopItem.hidden = true;
                return;
            }
            if (item instanceof Shield) {
                playerInventory.shield = item;
                action.shopItem.hidden = true;
                return;
            }
            if (item instanceof Weapon) {
                playerInventory.weapon = item;
                action.shopItem.hidden = true;
                return;
            }
            if (item instanceof ActiveItem) {
                action.shopItem.hidden = true;
                if (playerInventory.active.name != "empty" && hasItem("tool_belt")) {
                    playerInventory.altActive = item.clone(new Position(GAMEWIDTH - 20, 90));
                    playerInventory.altActive.isAlt = true;
                    return;
                }
                playerInventory.active = item;
                return;
            }
            if (item instanceof Consumable) {
                return new ConsumeItem(item.name);
            }
            const i = playerInventory.passives.length;
            item.pos.update(BORDERTHICKLEFT + 13 + 18 * (i % 6), BORDERTHICKTOP + 13 + 18 * Math.floor(i / 6));
            if (item.name == "gold_bug") {
                gameState.bugCurse = true;
                soundManager.playSound(sounds.curse);
            }
            playerInventory.passives.push(item);
            return;
        }
        return action;
    }
    handleClick = () => {
        let action = handleMouseClick(gameState.level.shop.objects);
        if (!action) {
            return;
        }
        action = this.handleAction(action);
        if (!action) {
            return;
        }
        return action;
    };
    handleHover = (cursorPos) => {
        let action = handleMouseHover(gameState.level.shop.objects);
        if (action instanceof ShopItemDescription) {
            this.currentText = action.description;
            return;
        }
        else {
            this.currentText =
                "Right click one of your items to sell for some change.";
        }
        return action;
    };
    handleNotHover = () => {
        let action = handleMouseNotHover(gameState.level.shop.objects);
        return action;
    };
}
