import Position from "../../position.js";
import { Item } from "../item.js";
import { Chisel } from "./chisel.js";
import { SilverBell } from "./silverBell.js";
const book = new Item({
    spriteSheetPos: new Position(4, 7),
    name: "book",
    shopName: "",
    cost: 0,
    descriptionText: "Click to open the guide book.",
});
export const itemDic = {
    gold_bug: new Item({
        spriteSheetPos: new Position(0, 4),
        name: "gold_bug",
        shopName: "Gold Bug",
        cost: 20,
        descriptionText: "More gold during caves and when clearing levels. More worms.",
    }),
    silver_bell: new SilverBell(),
    dark_crystal: new Item({
        spriteSheetPos: new Position(4, 4),
        name: "dark_crystal",
        shopName: "Dark Crystal",
        cost: 15,
        descriptionText: "Allows you to break blocks you can't see.",
    }),
    detonator: new Item({
        spriteSheetPos: new Position(6, 4),
        name: "detonator",
        shopName: "Detonator",
        cost: 20,
        descriptionText: "Use this to break all unmarked blocks around a block instantly.",
    }),
    drill: new Item({
        spriteSheetPos: new Position(8, 4),
        name: "drill",
        shopName: "Drill",
        cost: 12,
        descriptionText: "When breaking a safe block all connected safe blocks are also broken. Doesn't collect gold.",
    }),
    health_insurance: new Item({
        spriteSheetPos: new Position(10, 4),
        name: "health_insurance",
        shopName: "Health Insurance",
        cost: 22,
        descriptionText: "Gain 1 heart when clearing a level.",
    }),
    carving_knife: new Item({
        spriteSheetPos: new Position(12, 4),
        name: "carving_knife",
        shopName: "Carving Knife",
        cost: 8,
        descriptionText: "Gain 2 gold for every enemy killed.",
    }),
    chisel: new Chisel(),
    safety_helmet: new Item({
        spriteSheetPos: new Position(2, 5),
        name: "safety_helmet",
        shopName: "Safety Helmet",
        cost: 22,
        descriptionText: "+1 defense each fight.",
    }),
    empty: new Item({
        spriteSheetPos: new Position(14, 4),
        name: "empty",
        shopName: "",
        cost: 0,
        descriptionText: "",
    }),
    picaxe: new Item({
        spriteSheetPos: new Position(0, 7),
        name: "picaxe",
        shopName: "",
        cost: 0,
        descriptionText: "Left click any block that's not hidden to break it.",
    }),
    flag: new Item({
        spriteSheetPos: new Position(2, 7),
        name: "flag",
        shopName: "",
        cost: 0,
        descriptionText: "Right click any block to mark it as a possible threat.",
    }),
    book: book,
};
export function getItem(itemName, screenPos = new Position()) {
    let item = itemDic[itemName].clone();
    item.pos.update(screenPos);
    return item;
}
