import { ToggleBook, ToggleInventory } from "../action.js";
import { canvasManager } from "../canvasManager.js";
import Position from "../gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP } from "../global.js";
import { soundManager } from "../sounds/soundManager.js";
import { sprites } from "../sprites.js";
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
export const musicButton = new Item({
    spriteSheetPos: new Position(8, 7),
    name: "",
    shopName: "",
    cost: 0,
    descriptionText: "Toggle music.",
    pos: new Position(4, 54),
});
musicButton.render = () => {
    canvasManager.renderSpriteFromSheet(sprites.item_sheet, musicButton.pos, 16, 16, musicButton.spriteSheetPos.add(musicButton.mouseHeldLeft ? 2 : soundManager.mutedMusic ? 0 : 4, 0));
    if (musicButton.mouseHovering) {
        canvasManager.renderSpriteFromSheet(musicButton.sprite, musicButton.pos, musicButton.width, musicButton.height, musicButton.spriteSheetPos.add(1 + (musicButton.mouseHeldLeft ? 2 : soundManager.mutedMusic ? 0 : 4), 0));
    }
};
musicButton.clickFunction = () => {
    soundManager.muteMusic();
};
export const sfxButton = new Item({
    spriteSheetPos: new Position(8, 8),
    name: "",
    shopName: "",
    cost: 0,
    descriptionText: "Toggle sound effects.",
    pos: new Position(4, 72),
});
sfxButton.render = () => {
    canvasManager.renderSpriteFromSheet(sprites.item_sheet, sfxButton.pos, 16, 16, sfxButton.spriteSheetPos.add(sfxButton.mouseHeldLeft ? 2 : soundManager.mutedSfx ? 0 : 4, 0));
    if (sfxButton.mouseHovering) {
        canvasManager.renderSpriteFromSheet(sfxButton.sprite, sfxButton.pos, sfxButton.width, sfxButton.height, sfxButton.spriteSheetPos.add(1 + (sfxButton.mouseHeldLeft ? 2 : soundManager.mutedSfx ? 0 : 4), 0));
    }
};
sfxButton.clickFunction = () => {
    soundManager.muteSfx();
};
bookItem.clickFunction = () => new ToggleBook();
bagItem.clickFunction = () => new ToggleInventory();
