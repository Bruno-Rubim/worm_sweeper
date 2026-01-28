import Position from "../../gameElements/position.js";
import { gameState } from "../../gameState.js";
import { sprites } from "../../sprites.js";
import { Weapon } from "./weapon.js";
export default class TimeBlade extends Weapon {
    constructor() {
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
    }
    get description() {
        return ("$dmgDamage: " +
            this.totalDamage +
            "\n$spdCooldown: " +
            this.cooldown +
            "s" +
            "\n1 Damage for every 100 seconds left.");
    }
    get totalDamage() {
        return Math.floor((gameState.gameTimer.secondsRemaining / 100) * 2) / 2;
    }
}
