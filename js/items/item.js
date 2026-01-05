import { ItemDescription, RingBell, ToggleBook } from "../action.js";
import GameObject from "../gameObject.js";
import { GAMEWIDTH, LEFT, RIGHT } from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import { GAMETIMERSYNC, Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import timeTracker from "../timer/timeTracker.js";
export class Item extends GameObject {
    spriteSheetPos;
    name;
    shopName;
    description;
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
        this.description = args.description;
    }
    clone() {
        return new Item({
            pos: new Position().add(this.pos),
            spriteSheetPos: this.spriteSheetPos,
            name: this.name,
            shopName: this.shopName,
            cost: this.cost,
            description: this.description,
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
const book = new Item({
    spriteSheetPos: new Position(4, 7),
    name: "book",
    shopName: "",
    cost: 0,
    description: "Click to open the guide book.",
});
class SilverBell extends Item {
    rang = false;
    ringTimer = new Timer({
        goalSecs: 60,
        goalFunc: () => {
            this.rang = true;
            this.firstAnimationTic = timeTracker.currentGameTic;
        },
        classes: [GAMETIMERSYNC],
        deleteAtEnd: false,
    });
    constructor(pos) {
        super({
            pos: pos ?? new Position(),
            spriteSheetPos: new Position(2, 4),
            name: "silver_bell",
            shopName: "Silver Bell",
            cost: 20,
            description: "Reveals the location of doors. Recharges outside of shop every 60 seconds.",
        });
        timerQueue.push(this.ringTimer);
    }
    render(canvasManager) {
        if (this.ringTimer.inMotion) {
            canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.spriteSheetPos);
        }
        else {
            canvasManager.renderAnimationFrame(sprites.bell_shine_sheet, this.pos, this.width, this.height, 4, 2, this.firstAnimationTic, timeTracker.currentTic, 0.5);
        }
        if (this.mouseHovering) {
            canvasManager.renderSpriteFromSheet(this.sprite, this.pos, this.width, this.height, this.spriteSheetPos.add(1, 0));
        }
    }
    clickFunction = (cursorPos, button) => {
        if (!this.ringTimer.inMotion) {
            this.ringTimer.start();
            return new RingBell();
        }
    };
    clone() {
        return new SilverBell(new Position().add(this.pos));
    }
}
const silver_bell = new SilverBell();
export const itemDic = {
    gold_bug: new Item({
        spriteSheetPos: new Position(0, 4),
        name: "gold_bug",
        shopName: "Gold Bug",
        cost: 20,
        description: "More gold. More worms.\nThe bug's curse is everlasting.",
    }),
    silver_bell: silver_bell,
    dark_crystal: new Item({
        spriteSheetPos: new Position(4, 4),
        name: "dark_crystal",
        shopName: "Dark Crystal",
        cost: 25,
        description: "Allows you to break blocks you can't see.",
    }),
    detonator: new Item({
        spriteSheetPos: new Position(6, 4),
        name: "detonator",
        shopName: "Detonator",
        cost: 23,
        description: "Use this to break all unmarked blocks around a block instantly.",
    }),
    drill: new Item({
        spriteSheetPos: new Position(8, 4),
        name: "drill",
        shopName: "Drill",
        cost: 36,
        description: "When breaking a safe block all connected safe blocks are also broken.",
    }),
    health_insurance: new Item({
        spriteSheetPos: new Position(10, 4),
        name: "health_insurance",
        shopName: "Health Insurance",
        cost: 40,
        description: "Gain 1 heart when clearing a level.",
    }),
    empty: new Item({
        spriteSheetPos: new Position(14, 4),
        name: "empty",
        shopName: "",
        cost: 0,
        description: "",
    }),
    picaxe: new Item({
        spriteSheetPos: new Position(0, 7),
        name: "picaxe",
        shopName: "",
        cost: 0,
        description: "Left click any block that's not hidden to break it.",
    }),
    flag: new Item({
        spriteSheetPos: new Position(2, 7),
        name: "flag",
        shopName: "",
        cost: 0,
        description: "Right click any block to mark it as a possible threat.",
    }),
    book: book,
};
export function getItem(itemName, screenPos = new Position()) {
    let item = itemDic[itemName].clone();
    item.pos.update(screenPos);
    return item;
}
