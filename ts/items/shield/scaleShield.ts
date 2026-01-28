import Position from "../../gameElements/position.js";
import { gameState } from "../../gameState.js";
import { sprites } from "../../sprites.js";
import { Shield } from "./shield.js";

export default class ScaleShield extends Shield {
  constructor() {
    super({
      spriteSheetPos: new Position(10, 1),
      bigSprite: sprites.big_shield_scale,
      name: "scale_shield",
      shopName: "Scale Shield",
      cost: 29,
      defense: 1.5,
      cooldown: 3,
      descFontSize: 0.4,
    });
  }

  get totalDefense() {
    return this.defense + gameState.scalesCollected * 0.5;
  }

  get description() {
    return (
      (this.totalDefense > 0
        ? "$dfsDefense: " + this.totalDefense + "\n"
        : "") +
      (this.reflection > 0 ? "$refReflection: " + this.reflection + "\n" : "") +
      (this.spikes > 0 ? "$spkSpikes: " + this.spikes + "\n" : "") +
      (this.stun > 0 ? "$stnStun: " + this.stun + "s\n" : "") +
      (this.cooldown > 0 ? "$spdCooldown: " + this.cooldown + "s\n" : "") +
      "Gains 0.5 $dfsdefense for each Scale Worm defeated."
    );
  }
}
