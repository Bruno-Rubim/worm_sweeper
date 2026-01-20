import Position from "../../gameElements/position.js";
import { GAMEWIDTH } from "../../global.js";
import { Item } from "../item.js";
export class Armor extends Item {
    defense;
    speedMult;
    reflection;
    protection;
    spikes;
    constructor(args) {
        args.defense = args.defense ?? 0;
        args.reflection = args.reflection ?? 0;
        args.spikes = args.spikes ?? 0;
        args.protection = args.protection ?? 0;
        args.speedMult = args.speedMult ?? 1;
        super({
            ...args,
            pos: new Position(GAMEWIDTH - 20, 54),
            descriptionText: (args.defense > 0 ? "$dfsDefense: " + args.defense + "\n" : "") +
                (args.protection > 0
                    ? "$proProtection: " + args.protection + "\n"
                    : "") +
                (args.spikes > 0 ? "$spkSpikes: " + args.spikes + "\n" : "") +
                ((args.reflection ?? 0 > 0)
                    ? "$refDefense: " + args.reflection + "\n"
                    : "") +
                (args.speedMult > 1
                    ? "$slwSpeed: +" +
                        Math.abs(Math.floor((1 - args.speedMult) * 100)) +
                        "%"
                    : "") +
                (args.speedMult < 1 && args.speedMult
                    ? "$spdSpeed: -" + Math.floor((1 - args.speedMult) * 100) + "%"
                    : ""),
        });
        this.descFontSize = 0.6;
        this.defense = args.defense;
        this.speedMult = args.speedMult;
        this.reflection = args.reflection;
        this.spikes = args.spikes;
        this.protection = args.protection;
    }
}
export const armorDic = {
    chainmail: new Armor({
        spriteSheetPos: new Position(0, 2),
        name: "chainmail",
        shopName: "Chainmail",
        cost: 25,
        defense: 1,
        protection: 1,
        speedMult: 1.2,
    }),
    swift_vest: new Armor({
        spriteSheetPos: new Position(2, 2),
        name: "swift_vest",
        shopName: "Swift Vest",
        cost: 38,
        defense: 0,
        speedMult: 0.7,
    }),
    silver_chestplate: new Armor({
        spriteSheetPos: new Position(4, 2),
        name: "silver_chestplate",
        shopName: "Silver Chestplate",
        cost: 72,
        defense: 2,
        speedMult: 1.3,
        protection: 3,
    }),
    empty: new Armor({
        spriteSheetPos: new Position(14, 2),
        name: "empty",
        shopName: "empty",
        cost: 0,
        defense: 0,
    }),
};
