import { ObtainItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { GAMEWIDTH } from "../../global.js";
import { Slot } from "../../inventory/slot.js";
import { soundManager } from "../../sounds/soundManager.js";
import sounds from "../../sounds/sounds.js";
export default class LootSlot extends Slot {
    constructor() {
        super(new Position(GAMEWIDTH / 2 - 8, 36));
        this.clickFunction = (cursorPos, button) => {
            const item = this.item;
            this.item = this.emptyItem;
            soundManager.playSound(sounds.clear);
            return new ObtainItem(item);
        };
    }
}
