import { GAMEWIDTH } from "../../global.js";
import { type highlight } from "../actionBar.js";
import Position from "../../position.js";
import { type Sprite } from "../../sprites.js";
import { Item } from ".././item.js";

export class Weapon extends Item {
  bigSprite: Sprite;
  damage: number;
  spikes: number;
  cooldown: number;
  actionHighlights: highlight[];

  constructor(args: {
    spriteSheetPos: Position;
    bigSprite: Sprite;
    name: string;
    shopName: string;
    cost: number;
    damage: number;
    actionHighlights: highlight[];
    cooldown: number;
    spikes?: number;
  }) {
    super({
      ...args,
      pos: new Position(GAMEWIDTH - 20, 18),
      descriptionText:
        "$dmgDamage: " +
        args.damage +
        (args.spikes ?? 0 > 0 ? "\n$spkSpikes: " + args.spikes : "") +
        "\n$spdAttack Time: " +
        args.cooldown +
        "s",
    });
    this.bigSprite = args.bigSprite;
    this.damage = args.damage;
    this.spikes = args.spikes ?? 0;
    this.cooldown = args.cooldown;
    this.descFontSize = 0.6;
    this.actionHighlights = args.actionHighlights;
  }

  get totalDamage() {
    return this.damage;
  }
}
