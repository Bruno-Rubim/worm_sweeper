import CanvasManager from "../canvasManager.js";
import { GAMEWIDTH } from "../global.js";
import { ConsumeItem } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import timeTracker from "../timer/timeTracker.js";
import { Item } from "./item.js";
export class Consumable extends Item {
    constructor(args) {
        super({ ...args, pos: new Position(GAMEWIDTH - 20, 72) });
        this.clickFunction = () => {
            return new ConsumeItem(this.name);
        };
    }
}
export const consumableDic = {
    bomb: new Consumable({
        spriteSheetPos: new Position(0, 0),
        name: "bomb",
        shopName: "Bomb",
        cost: 13,
        description: "",
    }),
    health_potion_big: new Consumable({
        spriteSheetPos: new Position(2, 0),
        name: "health_potion_big",
        shopName: "Big Health Potion",
        cost: 15,
        description: "Gain 2 hearts.",
    }),
    health_potion: new Consumable({
        spriteSheetPos: new Position(4, 0),
        name: "health_potion",
        shopName: "Health Potion",
        cost: 10,
        description: "Gain 1 heart.",
    }),
    time_potion: new Consumable({
        spriteSheetPos: new Position(6, 0),
        name: "time_potion",
        shopName: "Time Potion",
        cost: 10,
        description: "Recover 60 seconds$tim",
    }),
    empty: new Consumable({
        spriteSheetPos: new Position(14, 0),
        name: "empty",
        shopName: "",
        cost: 0,
        description: "",
    }),
};
consumableDic.time_potion.render = (canvasManager) => {
    let sheetPos = consumableDic.time_potion.spriteSheetPos;
    if (consumableDic.time_potion.mouseHovering) {
        sheetPos = sheetPos.add(1, 0);
    }
    canvasManager.renderSpriteFromSheet(consumableDic.time_potion.sprite, consumableDic.time_potion.pos, consumableDic.time_potion.width, consumableDic.time_potion.height, sheetPos);
    canvasManager.renderAnimationFrame(sprites.time_potion_pointer_sheet, consumableDic.time_potion.pos, 16, 16, 12, 1, consumableDic.time_potion.birthTic, timeTracker.currentGameTic);
    canvasManager.renderAnimationFrame(sprites.time_potion_pointer_sheet, consumableDic.time_potion.pos, 16, 16, 12, 1, consumableDic.time_potion.birthTic, timeTracker.currentGameTic, 1 / 12, new Position(0, 1));
};
