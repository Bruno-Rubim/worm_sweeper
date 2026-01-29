import { EquipItem, ItemDescription, SellItem, UseActiveItem, } from "../action.js";
import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { gameState } from "../gameState.js";
import { GAMEWIDTH, LEFT, RIGHT } from "../global.js";
import activeDict from "../items/active/dict.js";
import { SilverBell } from "../items/active/silverBell.js";
import { armorDict } from "../items/armor/armor.js";
import passivesDict from "../items/passiveDict.js";
import { shieldDict } from "../items/shield/dict.js";
import { weaponDict } from "../items/weapon/dict.js";
import { sprites } from "../sprites.js";
export class Slot extends GameObject {
    item;
    emptyItem = passivesDict.empty;
    constructor(pos, item) {
        super({
            sprite: sprites.item_sheet,
            pos: pos,
            clickFunction: (cursorPos, button) => {
                if (button == RIGHT) {
                }
                else {
                    return new EquipItem(this);
                }
            },
        });
        this.item = item ?? this.emptyItem;
    }
    switchItems(slot) {
        const newItem = slot.item;
        if (this.item.name == "empty") {
            slot.item = slot.emptyItem;
        }
        else {
            slot.item = this.item;
        }
        if (newItem.name == "empty") {
            this.item = this.emptyItem;
        }
        else {
            this.item = newItem;
        }
    }
    reset() {
        this.item = this.emptyItem;
    }
    render() {
        canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.item.spriteSheetPos);
        if (this.mouseHovering) {
            canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.item.spriteSheetPos.add(1, 0));
        }
    }
    hoverFunction = (cursorPos) => {
        if (this.item.description) {
            let side;
            if (cursorPos.x > GAMEWIDTH / 2) {
                side = RIGHT;
            }
            else {
                side = LEFT;
            }
            return new ItemDescription(this.item.description, side, this.item.descFontSize);
        }
    };
}
export class WeaponSlot extends Slot {
    item;
    emptyItem = weaponDict.wood_sword;
    constructor(item) {
        super(new Position(GAMEWIDTH - 20, 18), item);
        this.item = item;
    }
}
export class ShieldSlot extends Slot {
    item;
    emptyItem = shieldDict.wood_shield;
    constructor(item) {
        super(new Position(GAMEWIDTH - 20, 36), item);
        this.item = item;
    }
}
export class ArmorSlot extends Slot {
    item;
    emptyItem = armorDict.empty;
    constructor() {
        super(new Position(GAMEWIDTH - 20, 54));
        this.item = this.emptyItem;
    }
}
export class ActiveSlot extends Slot {
    item;
    emptyItem = activeDict.empty;
    alt;
    constructor(pos, item, alt = false) {
        super(pos, item);
        this.item = item ?? this.emptyItem;
        this.alt = alt;
        this.clickFunction = (cursorPos, button) => {
            if (button == LEFT) {
                if (gameState.inInventory) {
                    return new EquipItem(this);
                }
                return new UseActiveItem(this);
            }
            else {
                return new SellItem(this.item);
            }
        };
    }
    render() {
        canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.item.spriteSheetPos);
        if (this.item instanceof SilverBell && !this.item.ringTimer.inMotion) {
            canvasManager.renderAnimationFrame(sprites.bell_shine_sheet, this.pos, this.width, this.height, 4, 2, this.firstAnimationTic, 0.5);
        }
        if (this.mouseHovering) {
            canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.item.spriteSheetPos.add(1, 0));
        }
    }
    reset() {
        if (this.alt) {
            this.item = activeDict.locked;
        }
        else {
            this.item = this.emptyItem;
        }
    }
}
