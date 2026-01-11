import { PickupChisel, SellItem } from "../../action.js";
import { LEFT } from "../../global.js";
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
            cost: 6,
            descriptionText: "Use this to carve out gold from a block wihtout breaking it.",
        });
    }
    clickFunction = (cursorPos, button) => {
        if (button == LEFT) {
            if (!this.chiselTimer.inMotion) {
                return new PickupChisel(this);
            }
        }
        else {
            return new SellItem(this);
        }
    };
    clone() {
        return new Chisel(new Position().add(this.pos));
    }
}
