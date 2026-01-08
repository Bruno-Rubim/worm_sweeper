import { BuyShopItem } from "../action.js";
import { BORDERTHICKBOTTOM, BORDERTHICKLEFT, BORDERTHICKRIGHT, BORDERTHICKTOP, GAMEHEIGHT, GAMEWIDTH, } from "../global.js";
import { Armor } from "../items/armor/armor.js";
import { Consumable } from "../items/consumable/consumable.js";
import { Shield } from "../items/shield/shield.js";
import { Weapon } from "../items/weapon/weapon.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import { handleMouseClick, handleMouseHover } from "../updateGame.js";
import SceneManager from "./sceneManager.js";
export default class ShopManager extends SceneManager {
    constructor(gameState, scenePos, soundManager) {
        super(gameState, scenePos, soundManager);
    }
    render = (canvasManager) => {
        canvasManager.renderSprite(sprites.bg_shop, new Position(BORDERTHICKLEFT, BORDERTHICKTOP), GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT, GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM);
        this.gameState.level.shop?.objects.forEach((obj) => {
            if (!obj.hidden) {
                obj.render(canvasManager);
            }
        });
    };
    handleClick = () => {
        const action = handleMouseClick(this.gameState.level.shop.objects);
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
            }
            else if (item instanceof Shield) {
                inventory.shield = item;
                action.shopItem.hidden = true;
            }
            else if (item instanceof Weapon) {
                inventory.weapon = item;
                action.shopItem.hidden = true;
            }
            else if (item instanceof Consumable) {
                inventory.consumable = item;
                action.shopItem.hidden = true;
            }
            else {
                if (inventory.passive_1.name == "empty") {
                    item.pos.update(4, 18 * 1);
                    inventory.passive_1 = item;
                    action.shopItem.hidden = true;
                }
                else if (inventory.passive_2.name == "empty") {
                    item.pos.update(4, 18 * 2);
                    inventory.passive_2 = item;
                    action.shopItem.hidden = true;
                }
                else if (inventory.passive_3.name == "empty") {
                    item.pos.update(4, 18 * 3);
                    inventory.passive_3 = item;
                    action.shopItem.hidden = true;
                }
                else if (inventory.passive_4.name == "empty") {
                    item.pos.update(4, 18 * 4);
                    inventory.passive_4 = item;
                    action.shopItem.hidden = true;
                }
                else if (inventory.passive_5.name == "empty") {
                    item.pos.update(4, 18 * 5);
                    inventory.passive_5 = item;
                    action.shopItem.hidden = true;
                }
                else if (inventory.passive_6.name == "empty") {
                    item.pos.update(4, 18 * 6);
                    inventory.passive_6 = item;
                    action.shopItem.hidden = true;
                }
            }
            return;
        }
        return action;
    };
    handleHover = (cursorPos) => {
        return handleMouseHover(this.gameState.level.shop.objects);
    };
}
