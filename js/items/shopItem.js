import GameObject from "../gameObject.js";
import { CLICKLEFT } from "../global.js";
import { BuyShopItem } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import timeTracker from "../timer/timeTracker.js";
import { armorDic } from "./armor.js";
import { consumableDic } from "./consumable.js";
import { itemDic } from "./item.js";
import { shieldDic } from "./shield.js";
import { weaponDic } from "./weapon.js";
const shopItemSpecs = {
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
        this.item = shopItemSpecs[itemName];
        this.clickFunction = (cursorPos, button) => {
            if (button == CLICKLEFT)
                return new BuyShopItem(this);
        };
    }
    render(canvasManager) {
        canvasManager.renderSpriteFromSheet(sprites.item_sheet, this.pos, 16, 16, this.item.spriteSheetPos.add(this.mouseHovering ? 1 : 0, 0));
        canvasManager.renderText("numbers_cost", this.pos.add(2, 18), this.item.cost.toString());
        if (this.item.name == "time_potion") {
            canvasManager.renderAnimationFrame(sprites.time_potion_pointer_sheet, this.pos, 16, 16, 12, 1, this.birthTic, timeTracker.currentGameTic);
            canvasManager.renderAnimationFrame(sprites.time_potion_pointer_sheet, this.pos, 16, 16, 12, 1, this.birthTic, timeTracker.currentGameTic, 1 / 12, new Position(0, 1));
        }
        if (this.mouseHovering) {
            canvasManager.renderText("shop_description", new Position(27, 95), this.item.shopName + "\n\n" + this.item.description, "right", 120, 0.8);
        }
    }
}
