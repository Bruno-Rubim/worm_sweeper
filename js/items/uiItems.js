import { ToggleBook, ToggleInventory } from "../action.js";
import Position from "../gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, GAMEWIDTH } from "../global.js";
import { Item } from "./item.js";
export const picaxeItem = new Item({
    spriteSheetPos: new Position(0, 7),
    name: "picaxe",
    shopName: "",
    cost: 0,
    descriptionText: "Left click any block that's been revealed to break it.",
    pos: new Position(BORDERTHICKLEFT + 13, BORDERTHICKTOP + 13),
});
export const flagItem = new Item({
    spriteSheetPos: new Position(2, 7),
    name: "flag",
    shopName: "",
    cost: 0,
    descriptionText: "Right click any block to mark it as a possible threat.",
    pos: new Position(BORDERTHICKLEFT + 13 + 18, BORDERTHICKTOP + 13),
});
export const bookItem = new Item({
    spriteSheetPos: new Position(4, 7),
    name: "book",
    shopName: "",
    cost: 0,
    descriptionText: "Click to open or close the guide book.",
    pos: new Position(4, 36),
});
export const bagItem = new Item({
    spriteSheetPos: new Position(6, 7),
    name: "bag",
    shopName: "",
    cost: 0,
    descriptionText: "Click to open or close the inventory.",
    pos: new Position(4, 18),
});
bookItem.clickFunction = () => new ToggleBook();
bagItem.clickFunction = () => new ToggleInventory();
