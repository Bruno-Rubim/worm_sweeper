import { canvasManager } from "../../canvasManager.js";
import Position from "../../gameElements/position.js";
import { sprites } from "../../sprites.js";
import timeTracker from "../../timer/timeTracker.js";
import { InstantItem } from "./instantItem.js";
export default class TimePotion extends InstantItem {
    constructor() {
        super({
            spriteSheetPos: new Position(4, 6),
            name: "time_potion",
            shopName: "Time Potion",
            cost: 10,
            descriptionText: "Recover 60 seconds$tim",
        });
    }
}
