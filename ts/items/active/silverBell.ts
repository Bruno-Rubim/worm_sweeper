import { canvasManager } from "../../canvasManager.js";
import Position from "../../gameElements/position.js";
import { GAMEWIDTH } from "../../global.js";
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
  constructor(pos?: Position, isAlt?: boolean) {
    pos ??= new Position(GAMEWIDTH - 20, 72);
    super({
      pos: new Position(pos),
      spriteSheetPos: new Position(2, 0),
      name: "silver_bell",
      shopName: "Silver Bell",
      cost: 15,
      descriptionText:
        "Reveals the location of doors, or $stn stuns enemies if used during battle. Recharges outside of shop every 60 seconds.",
      isAlt: isAlt ?? false,
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

  clone(position?: Position): SilverBell {
    return new SilverBell(new Position(position ?? this.pos), this.isAlt);
  }
}
