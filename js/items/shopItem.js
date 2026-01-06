import GameObject from "../gameObject.js";
import { CLICKLEFT } from "../global.js";
import { BuyShopItem } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import timeTracker from "../timer/timeTracker.js";
import { armorDic } from "./armor.js";
import { consumableDic } from "./consumable.js";
import { itemDic, SilverBell } from "./item.js";
import { shieldDic } from "./shield.js";
import { weaponDic } from "./weapon.js";
import { timerQueue } from "../timer/timerQueue.js";
const items = {
    ...weaponDic,
    ...armorDic,
    ...consumableDic,
    ...shieldDic,
    ...itemDic,
};
export class ShopItem extends GameObject {
    item;
    constructor(itemName) {
        super({
            pos: new Position(),
            sprite: sprites.item_sheet,
            hitboxWidth: 20,
            hitboxPosShift: new Position(-2, 0),
        });
        this.item = items[itemName];
        this.clickFunction = (cursorPos, button) => {
            if (this.item instanceof SilverBell) {
                timerQueue.push(this.item.ringTimer);
            }
            if (button == CLICKLEFT)
                return new BuyShopItem(this);
        };
    }
    render(canvasManager) {
        canvasManager.renderSpriteFromSheet(sprites.item_sheet, this.pos, 16, 16, this.item.spriteSheetPos);
        if (this.mouseHovering) {
            canvasManager.renderSpriteFromSheet(sprites.item_sheet, this.pos, 16, 16, this.item.spriteSheetPos.add(1, 0));
        }
        canvasManager.renderText("numbers_cost", this.pos.add(2, 18), this.item.cost.toString());
        if (this.item.name == "time_potion") {
            canvasManager.renderAnimationFrame(sprites.time_potion_pointer_sheet, this.pos, 16, 16, 12, 1, this.firstAnimationTic, timeTracker.currentGameTic);
            canvasManager.renderAnimationFrame(sprites.time_potion_pointer_sheet, this.pos, 16, 16, 12, 1, this.firstAnimationTic, timeTracker.currentGameTic, 1 / 12, new Position(0, 1));
        }
        if (this.mouseHovering) {
            canvasManager.renderText("shop_description", new Position(27, 95), this.item.shopName + "\n\n" + this.item.description, "right", 120, 0.8);
        }
    }
}
