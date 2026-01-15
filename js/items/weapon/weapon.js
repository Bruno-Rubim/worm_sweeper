import { GAMEWIDTH } from "../../global.js";
import Position from "../../position.js";
import { sounds } from "../../sounds.js";
import {} from "../../sprites.js";
import { Item } from ".././item.js";
export class Weapon extends Item {
    bigSprite;
    damage;
    spikes;
    cooldown;
    sound;
    constructor(args) {
        super({
            ...args,
            pos: new Position(GAMEWIDTH - 20, 18),
            descriptionText: "$dmgDamage: " +
                args.damage +
                (args.spikes ?? 0 > 0 ? "\n$spkSpikes: " + args.spikes : "") +
                "\n$spdCooldown: " +
                args.cooldown +
                "s",
        });
        this.bigSprite = args.bigSprite;
        this.damage = args.damage;
        this.spikes = args.spikes ?? 0;
        this.sound = args.sound ?? sounds.stab;
        this.cooldown = args.cooldown;
        this.descFontSize = 0.6;
    }
    get totalDamage() {
        return this.damage;
    }
}
