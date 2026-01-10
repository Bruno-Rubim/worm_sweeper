import { SellItem as SellItem, RingBell } from "../../action.js";
import type CanvasManager from "../../canvasManager.js";
import { LEFT, type cursorClick } from "../../global.js";
import Position from "../../position.js";
import { sprites } from "../../sprites.js";
import { GAMETIMERSYNC, Timer } from "../../timer/timer.js";
import { timerQueue } from "../../timer/timerQueue.js";
import timeTracker from "../../timer/timeTracker.js";
import { Item } from "../item.js";

export class SilverBell extends Item {
  rang = false;
  ringTimer = new Timer({
    goalSecs: 60,
    goalFunc: () => {
      this.rang = true;
      this.firstAnimationTic = timeTracker.currentGameTic;
    },
    classes: [GAMETIMERSYNC],
    deleteAtEnd: false,
  });
  constructor(pos?: Position) {
    super({
      pos: pos ?? new Position(),
      spriteSheetPos: new Position(2, 4),
      name: "silver_bell",
      shopName: "Silver Bell",
      cost: 15,
      descriptionText:
        "Reveals the location of doors, also stuns enemies if used during battle. Recharges outside of shop every 60 seconds.",
    });
    if (!timerQueue.includes(this.ringTimer)) {
      timerQueue.push(this.ringTimer);
    }
  }

  render(canvasManager: CanvasManager): void {
    if (this.ringTimer.inMotion) {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.spriteSheetPos
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
        0.5
      );
    }
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.spriteSheetPos.add(1, 0)
      );
    }
  }

  clickFunction = (cursorPos: Position, button: cursorClick) => {
    if (button == LEFT) {
      if (!this.ringTimer.inMotion) {
        this.ringTimer.start();
        return new RingBell();
      }
    } else {
      return new SellItem(this);
    }
  };

  clone(): SilverBell {
    return new SilverBell(new Position().add(this.pos));
  }
}
