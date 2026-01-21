import Position from "../gameElements/position.js";
import { Item } from "./item.js";
import { SilverBell } from "./silverBell.js";
const genericDict = {
    gold_bug: new Item({
        spriteSheetPos: new Position(0, 4),
        name: "gold_bug",
        shopName: "Gold Bug",
        cost: 20,
        descriptionText: "More gold during caves and when clearing levels. More worms.",
    }),
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
    whetstone: new Item({
        spriteSheetPos: new Position(0, 5),
        name: "whetstone",
        shopName: "Whetstone",
        cost: 18,
        descriptionText: "Reduces weapon $spdcooldown after attacking for 5% per damage dealt.",
    }),
    safety_helmet: new Item({
        spriteSheetPos: new Position(2, 5),
        name: "safety_helmet",
        shopName: "Safety Helmet",
        cost: 22,
        descriptionText: "+1 defense each fight.",
    }),
    backpack: new Item({
        spriteSheetPos: new Position(4, 5),
        name: "backpack",
        shopName: "Backpack",
        cost: 16,
        descriptionText: "Get an additional inventory space. Not resellable.",
    }),
    bracer: new Item({
        spriteSheetPos: new Position(6, 5),
        name: "bracer",
        shopName: "Bracer",
        cost: 36,
        descriptionText: "Adds 0.5 $dfsdefense to your shield.",
    }),
    silver_bell: new SilverBell(),
    empty: new Item({
        spriteSheetPos: new Position(14, 4),
        name: "empty",
        shopName: "",
        cost: 0,
        descriptionText: "",
    }),
    locked_slot: new Item({
        spriteSheetPos: new Position(-1, -1),
        name: "locked_slot",
        shopName: "",
        cost: 0,
        descriptionText: "",
    }),
};
export function getItem(itemName, screenPos = new Position()) {
    let item = genericDict[itemName].clone();
    item.pos.update(screenPos);
    return item;
}
export default genericDict;
