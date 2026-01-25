import { ItemDescription, SellItem } from "../action.js";
import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import { GAMEWIDTH, LEFT, RIGHT, type cursorClick } from "../global.js";
import Position from "../gameElements/position.js";
import { sprites } from "../sprites.js";

export class Item extends GameObject {
  spriteSheetPos: Position;
  name: string;
  shopName: string;
  descriptionText: string;
  descFontSize = 0.4;
  cost: number;

  constructor(args: {
    pos?: Position;
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText: string;
  }) {
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
    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      if (button == RIGHT) {
        return new SellItem(this);
      }
    };
    this.descriptionText = args.descriptionText;
  }

  get description() {
    return this.descriptionText;
  }

  get finalCost() {
    return this.cost;
  }

  clone(position?: Position): Item {
    return new Item({
      pos: new Position(position),
      spriteSheetPos: this.spriteSheetPos,
      name: this.name,
      shopName: this.shopName,
      cost: this.cost,
      descriptionText: this.descriptionText,
    });
  }

  render(): void {
    canvasManager.renderSpriteFromSheet(
      this.sprite,
      this.pos,
      this.width,
      this.height,
      this.spriteSheetPos,
    );
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.spriteSheetPos.add(1, 0),
      );
    }
  }

  hoverFunction = (cursorPos: Position) => {
    if (this.description) {
      let side: typeof LEFT | typeof RIGHT;
      if (cursorPos.x > GAMEWIDTH / 2) {
        side = RIGHT;
      } else {
        side = LEFT;
      }
      return new ItemDescription(this.description, side, this.descFontSize);
    }
  };
}
