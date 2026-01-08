import { PickupChisel } from "../../action.js";
import Position from "../../position.js";
import { GAMETIMERSYNC, Timer } from "../../timer/timer.js";
import { Item } from "../item.js";
export class Chisel extends Item {
    using = false;
    chiselTimer = new Timer({
        goalSecs: 3,
        classes: [GAMETIMERSYNC],
        deleteAtEnd: true,
    });
    constructor(pos) {
        super({
            pos: pos ?? new Position(),
            spriteSheetPos: new Position(0, 5),
            name: "chisel",
            shopName: "Chisel",
            cost: 13,
            descriptionText: "Use this to carve out 3 gold from a block.",
        });
    }
    clickFunction = (cursorPos, button) => {
        if (!this.chiselTimer.inMotion) {
            return new PickupChisel(this);
        }
    };
    clone() {
        return new Chisel(new Position().add(this.pos));
    }
}
