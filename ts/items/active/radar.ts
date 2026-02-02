import Position from "../../gameElements/position.js";
import { soundManager } from "../../sounds/soundManager.js";
import sounds from "../../sounds/sounds.js";
import { Timer } from "../../timer/timer.js";
import { GAMETIMERSYNC } from "../../timer/timerManager.js";
import timeTracker from "../../timer/timeTracker.js";
import { ActiveItem } from "./active.js";

export class Radar extends ActiveItem {
  animationTicStart = 0;

  useTimer = new Timer({
    goalSecs: 45,
    classes: [GAMETIMERSYNC],
    autoStart: false,
    goalFunc: () => {
      this.animationTicStart = timeTracker.currentGameTic;
      soundManager.playSound(sounds.radar_ready);
    },
  });
  constructor() {
    super({
      spriteSheetPos: new Position(6, 0),
      name: "radar",
      shopName: "Radar",
      cost: 40,
      descriptionText:
        "Reveals worms around it. Recharges outside of shop after 45 seconds.",
    });
  }
}
