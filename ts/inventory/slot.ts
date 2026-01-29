import { ItemDescription, SellItem } from "../action.js";
import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { gameState } from "../gameState.js";
import { GAMEWIDTH, LEFT, RIGHT, type cursorClick } from "../global.js";
import type { ActiveItem } from "../items/active/active.js";
import activeDict from "../items/active/dict.js";
import { armorDict, type Armor } from "../items/armor/armor.js";
import type { Item } from "../items/item.js";
import passivesDict from "../items/passiveDict.js";
import type { Shield } from "../items/shield/shield.js";
import type { Weapon } from "../items/weapon/weapon.js";
import { sprites } from "../sprites.js";

export class Slot extends GameObject {
  item: Item;
  constructor(pos: Position, item: Item = passivesDict.empty) {
    super({
      sprite: sprites.item_sheet,
      pos: pos,
      clickFunction: (cursorPos: Position, button: cursorClick) => {
        if (button == RIGHT && gameState.currentScene == "shop") {
          return new SellItem(this.item);
        }
      },
    });
    this.item = item;
  }

  replaceItem(item: Item) {
    this.item = item;
  }

  render(): void {
    canvasManager.renderSpriteFromSheet(
      this.sprite,
      this.pos,
      this.width,
      this.height,
      this.item.spriteSheetPos,
    );
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.item.spriteSheetPos.add(1, 0),
      );
    }
  }

  clickFunction = (cursorPos: Position, button: cursorClick) => {
    if (button == RIGHT) {
      return new SellItem(this.item);
    }
  };

  hoverFunction = (cursorPos: Position) => {
    if (this.item.description) {
      let side: typeof LEFT | typeof RIGHT;
      if (cursorPos.x > GAMEWIDTH / 2) {
        side = RIGHT;
      } else {
        side = LEFT;
      }
      return new ItemDescription(
        this.item.description,
        side,
        this.item.descFontSize,
      );
    }
  };
}

export class WeaponSlot extends Slot {
  constructor(item: Weapon) {
    super(new Position(GAMEWIDTH - 20, 18), item);
    this.item = item;
  }

  replaceItem(item: Weapon) {
    this.item = item;
  }
}

export class ShieldSlot extends Slot {
  constructor(item: Shield) {
    super(new Position(GAMEWIDTH - 20, 36), item);
    this.item = item;
  }

  replaceItem(item: Shield) {
    this.item = item;
  }
}

export class ArmorSlot extends Slot {
  constructor(item: Armor = armorDict.empty) {
    super(new Position(GAMEWIDTH - 20, 54), item);
    this.item = item;
  }

  replaceItem(item: Armor) {
    this.item = item;
  }
}

export class ActiveSlot extends Slot {
  constructor(item: ActiveItem = activeDict.empty, pos: Position) {
    super(pos, item);
    this.item = item;
  }

  replaceItem(item: ActiveItem) {
    this.item = item;
  }
}
