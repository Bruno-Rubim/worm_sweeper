import { SellItem as SellItem, RingBell } from "../action.js";
import { canvasManager } from "../canvasManager.js";
import Position from "../gameElements/position.js";
import { LEFT } from "../global.js";
import { sprites } from "../sprites.js";
import { Timer } from "../timer/timer.js";
import { GAMETIMERSYNC } from "../timer/timerManager.js";
import timeTracker from "../timer/timeTracker.js";
import { Item } from "./item.js";
export class SilverBell extends Item {
    rang = false;
    ringTimer = new Timer({
        goalSecs: 60,
        goalFunc: () => {
            this.rang = true;
            this.firstAnimationTic = timeTracker.currentGameTic;
        },
        classes: [GAMETIMERSYNC],
        autoStart: true,
    });
    constructor(pos) {
        super({
            pos: pos ?? new Position(),
            spriteSheetPos: new Position(2, 4),
            name: "silver_bell",
            shopName: "Silver Bell",
            cost: 15,
            descriptionText: "Reveals the location of doors, or $stn stuns enemies if used during battle. Recharges outside of shop every 60 seconds.",
        });
    }
    render() {
        if (this.ringTimer.inMotion) {
            canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.spriteSheetPos);
        }
        else {
            canvasManager.renderAnimationFrame(sprites.bell_shine_sheet, this.pos, this.width, this.height, 4, 2, this.firstAnimationTic, timeTracker.currentTic, 0.5);
        }
        if (this.mouseHovering) {
            canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.spriteSheetPos.add(1, 0));
        }
    }
    clickFunction = (cursorPos, button) => {
        if (button == LEFT) {
            if (!this.ringTimer.inMotion) {
                this.ringTimer.start();
                return new RingBell();
            }
        }
        else {
            return new SellItem(this);
        }
    };
    clone() {
        return new SilverBell(new Position().add(this.pos));
    }
}
