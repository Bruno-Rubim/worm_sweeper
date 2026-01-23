import { canvasManager } from "./canvasManager.js";
import { measureTextBoxHeight } from "./fontMaps.js";
import GameObject from "./gameElements/gameObject.js";
import { RIGHT } from "./global.js";
import Position from "./gameElements/position.js";
import { sprites } from "./sprites.js";
import { inputState } from "./input/inputState.js";
export const CURSORDEFAULT = "cursor_default";
export const CURSORPICAXE = "cursor_picaxe";
export const CURSORDETONATOR = "cursor_detonator";
export const CURSORARROW = "cursor_arrow";
export const CURSORBATTLE = "cursor_battle";
export const CURSORBOMB = "cursor_bomb";
export const CURSORGOLDWATER = "cursor_gold_water";
export const CURSORBOOK = "cursor_book";
export const CURSORNONE = "cursor_none";
const cursorSheetPos = {
    [CURSORDEFAULT]: new Position(0, 0),
    [CURSORPICAXE]: new Position(1, 0),
    [CURSORDETONATOR]: new Position(2, 0),
    [CURSORARROW]: new Position(3, 0),
    [CURSORBATTLE]: new Position(4, 0),
    [CURSORBOMB]: new Position(5, 0),
    [CURSORGOLDWATER]: new Position(6, 0),
    [CURSORBOOK]: new Position(0, 3),
    [CURSORNONE]: new Position(6, 3),
};
class Description extends GameObject {
    side = RIGHT;
    text = "";
    renderScale = 0.4;
    fontSize = 0.4;
    constructor(cursorPos) {
        super({
            sprite: sprites.description_box,
            pos: cursorPos,
            width: 56,
            height: 14,
        });
    }
    render() {
        if (this.hidden) {
            return;
        }
        const padding = 4 * this.renderScale;
        canvasManager.renderBox(sprites.description_box_sheet, this.pos.add(this.side == RIGHT ? -54 : 15, 6), 3, 3, this.width, measureTextBoxHeight("description", this.text, this.width, this.fontSize) +
            3 * this.renderScale, this.renderScale);
        canvasManager.renderText("description", this.pos.add((this.side == RIGHT ? -54 : 15) + padding, padding + 6), this.text, RIGHT, this.width, this.fontSize);
    }
}
class Cursor {
    pos = new Position();
    state = CURSORDEFAULT;
    description = new Description(this.pos);
    render(canvasManager) {
        canvasManager.renderSpriteFromSheet(sprites.cursor_sheet, this.pos, 16, 16, cursorSheetPos[this.state].add(0, inputState.mouse.heldLeft ? 1 : inputState.mouse.heldRight ? 2 : 0));
        this.description.render();
    }
}
export const cursor = new Cursor();
