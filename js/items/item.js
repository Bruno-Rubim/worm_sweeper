import { ItemDescription, ToggleBook } from "../action.js";
import GameObject from "../gameObject.js";
import { GAMEWIDTH, LEFT, RIGHT } from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
export class Item extends GameObject {
    spriteSheetPos;
    name;
    shopName;
    descriptionText;
    descFontSize = 0.4;
    cost;
    constructor(args) {
        super({
            pos: args.pos ?? new Position(),
            sprite: sprites.item_sheet,
            hitboxHeight: 18,
            hitboxWidth: 18,
            hitboxPosShift: new Position(-1, -1),
        });
        this.spriteSheetPos = args.spriteSheetPos;
        this.name = args.name;
        this.shopName = args.shopName;
        this.cost = args.cost;
        if (args.name == "book") {
            this.clickFunction = () => {
                return new ToggleBook();
            };
        }
        this.descriptionText = args.descriptionText;
    }
    get description() {
        return this.descriptionText;
    }
    clone() {
        return new Item({
            pos: new Position().add(this.pos),
            spriteSheetPos: this.spriteSheetPos,
            name: this.name,
            shopName: this.shopName,
            cost: this.cost,
            descriptionText: this.descriptionText,
        });
    }
    render(canvasManager) {
        canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.spriteSheetPos);
        if (this.mouseHovering) {
            canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.spriteSheetPos.add(1, 0));
        }
    }
    hoverFunction = (cursorPos) => {
        if (this.description) {
            let side;
            if (cursorPos.x > GAMEWIDTH / 2) {
                side = RIGHT;
            }
            else {
                side = LEFT;
            }
            return new ItemDescription(this.description, side, this.descFontSize);
        }
    };
}
