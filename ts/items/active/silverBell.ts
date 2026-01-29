import Position from "../../gameElements/position.js";
import { GAMEWIDTH } from "../../global.js";
import { Timer } from "../../timer/timer.js";
import { GAMETIMERSYNC } from "../../timer/timerManager.js";
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
}
