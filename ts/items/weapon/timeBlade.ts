import Position from "../../position.js";
import { sprites } from "../../sprites.js";
import { Timer } from "../../timer/timer.js";
import { Weapon } from "./weapon.js";

export default class TimeBlade extends Weapon {
  gameTimer: Timer;

  constructor(gameTimer: Timer = new Timer({})) {
    super({
      spriteSheetPos: new Position(6, 3),
      bigSprite: sprites.big_time_blade,
      name: "time_blade",
      shopName: "Time Blade",
      cost: 52,
      damage: 1,
      cooldown: 2.8,
    });
    this.descriptionText = "";
    this.descFontSize = 0.4;
    this.gameTimer = gameTimer;
  }

  get description() {
    return (
      "$dmgDamage: " +
      this.totalDamage +
      "\n$spdCooldown: " +
      this.cooldown +
      "s" +
      "\n1 Damage per 100 seconds left."
    );
  }

  get totalDamage() {
    return Math.floor((this.gameTimer.secondsRemaining / 100) * 2) / 2;
  }
}
