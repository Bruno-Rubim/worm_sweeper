import Position from "../../gameElements/position.js";
import { Timer } from "../../timer/timer.js";
import { GAMETIMERSYNC } from "../../timer/timerManager.js";
import { ActiveItem } from "./active.js";

export class SilverBell extends ActiveItem {
  ringTimer = new Timer({
    goalSecs: 60,
    classes: [GAMETIMERSYNC],
    autoStart: false,
  });
  constructor() {
    super({
      spriteSheetPos: new Position(2, 0),
      name: "silver_bell",
      shopName: "Silver Bell",
      cost: 15,
      descriptionText:
        "Reveals the location of doors, or stuns enemies if used during battle. Recharges outside of shop after 60 seconds.",
    });
  }
}
