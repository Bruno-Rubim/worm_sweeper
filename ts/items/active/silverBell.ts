import { SellItem as SellItem, UseActiveItem } from "../../action.js";
import { canvasManager } from "../../canvasManager.js";
import Position from "../../gameElements/position.js";
import { LEFT, type cursorClick } from "../../global.js";
import { sprites } from "../../sprites.js";
import { Timer } from "../../timer/timer.js";
import { GAMETIMERSYNC } from "../../timer/timerManager.js";
import timeTracker from "../../timer/timeTracker.js";
import { ActiveItem } from "./active.js";

export class SilverBell extends ActiveItem {
  ringTimer = new Timer({
    goalSecs: 60,
    classes: [GAMETIMERSYNC],
    autoStart: false,
  });
  constructor(pos?: Position) {
    super({
      pos: pos ?? new Position(),
      spriteSheetPos: new Position(2, 0),
      name: "silver_bell",
      shopName: "Silver Bell",
      cost: 15,
      descriptionText:
        "Reveals the location of doors, or $stn stuns enemies if used during battle. Recharges outside of shop every 60 seconds.",
    });
  }

  render(): void {
    if (this.ringTimer.inMotion) {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.spriteSheetPos,
      );
    } else {
      canvasManager.renderAnimationFrame(
        sprites.bell_shine_sheet,
        this.pos,
        this.width,
        this.height,
        4,
        2,
        this.firstAnimationTic,
        timeTracker.currentTic,
        0.5,
      );
    }
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.spriteSheetPos.add(1, 0),
      );
    }
  }

  clone(): SilverBell {
    return new SilverBell(new Position().add(this.pos));
  }
}
