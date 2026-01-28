import { GAMEWIDTH } from "../../global.js";
import Position from "../../gameElements/position.js";
import { Sprite } from "../../sprites.js";
import { Item } from ".././item.js";
export class Shield extends Item {
    bigSprite;
    defense;
    cooldown;
    reflection;
    spikes;
    stun;
    constructor(args) {
        args.defense = args.defense ?? 0;
        args.reflection = args.reflection ?? 0;
        args.spikes = args.spikes ?? 0;
        args.stun = args.stun ?? 0;
        args.descFontSize = args.descFontSize ?? 0.6;
        super({
            ...args,
            pos: new Position(GAMEWIDTH - 20, 36),
            descriptionText: (args.defense > 0 ? "$dfsDefense: " + args.defense + "\n" : "") +
                (args.reflection > 0
                    ? "$refReflection: " + args.reflection + "\n"
                    : "") +
                (args.spikes > 0 ? "$spkSpikes: " + args.spikes + "\n" : "") +
                (args.stun > 0 ? "$stnStun: " + args.stun + "s\n" : "") +
                (args.cooldown > 0 ? "$spdCooldown: " + args.cooldown + "s\n" : ""),
        });
        this.cooldown = args.cooldown;
        this.bigSprite = args.bigSprite;
        this.defense = args.defense;
        this.reflection = args.reflection;
        this.spikes = args.spikes;
        this.stun = args.stun;
        this.descFontSize = args.descFontSize;
    }
    get totalDefense() {
        return this.defense;
    }
}
