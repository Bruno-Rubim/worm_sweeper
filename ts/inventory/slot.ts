import {
  EquipItem,
  ItemDescription,
  SellItem,
  UseActiveItem,
} from "../action.js";
import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { gameState } from "../gameState.js";
import { GAMEWIDTH, LEFT, RIGHT, type cursorClick } from "../global.js";
import { TimedActiveItem, type ActiveItem } from "../items/active/active.js";
import activeDict from "../items/active/dict.js";
import { Radar } from "../items/active/radar.js";
import { SilverBell } from "../items/active/silverBell.js";
import { armorDict, type Armor } from "../items/armor/armor.js";
import type { Item } from "../items/item.js";
import passivesDict from "../items/passiveDict.js";
import { shieldDict } from "../items/shield/dict.js";
import type { Shield } from "../items/shield/shield.js";
import { weaponDict } from "../items/weapon/dict.js";
import type { Weapon } from "../items/weapon/weapon.js";
import { sprites } from "../sprites.js";

export class Slot extends GameObject {
  item: Item;
  emptyItem: Item = passivesDict.empty;

  constructor(pos: Position, item?: Item) {
    super({
      sprite: sprites.item_sheet,
      pos: pos,
      clickFunction: (cursorPos: Position, button: cursorClick) => {
        if (button == RIGHT) {
          if (gameState.currentScene == "shop") {
            return new SellItem(this);
          }
        } else {
          return new EquipItem(this);
        }
      },
    });
    this.item = item ?? this.emptyItem;
  }

  switchItems(slot: Slot) {
    const newItem = slot.item;
    if (this.item.name == "empty") {
      slot.item = slot.emptyItem;
    } else {
      slot.item = this.item;
    }
    if (newItem.name == "empty") {
      this.item = this.emptyItem;
    } else {
      this.item = newItem;
    }
  }

  reset() {
    this.item = this.emptyItem;
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
  item: Weapon;
  emptyItem: Weapon = weaponDict.wood_sword;
  constructor(item: Weapon) {
    super(new Position(GAMEWIDTH - 20, 18), item);
    this.item = item;
  }
}

export class ShieldSlot extends Slot {
  item: Shield;
  emptyItem: Shield = shieldDict.wood_shield;
  constructor(item: Shield) {
    super(new Position(GAMEWIDTH - 20, 36), item);
    this.item = item;
  }
}

export class ArmorSlot extends Slot {
  item: Armor;
  emptyItem: Armor = armorDict.empty;
  constructor() {
    super(new Position(GAMEWIDTH - 20, 54));
    this.item = this.emptyItem;
  }
}

export class ActiveSlot extends Slot {
  item: ActiveItem;
  emptyItem: ActiveItem = activeDict.empty;
  alt: boolean;
  constructor(pos: Position, item?: ActiveItem, alt: boolean = false) {
    super(pos, item);
    this.item = item ?? this.emptyItem;
    this.alt = alt;

    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      if (button == LEFT) {
        if (gameState.inInventory) {
          return new EquipItem(this);
        }
        return new UseActiveItem(this);
      } else {
        return new SellItem(this);
      }
    };
  }

  render(): void {
    if (this.item instanceof TimedActiveItem && !this.item.useTimer.inMotion) {
      if (this.item.name == "silver_bell" && !this.item.useTimer.inMotion) {
        canvasManager.renderAnimationFrame(
          this.item.altSpriteSheet,
          this.pos,
          this.width,
          this.height,
          4,
          2,
          this.animationTicStart,
          0.5,
        );
      } else {
        canvasManager.renderSpriteFromSheet(
          this.item.altSpriteSheet,
          this.pos,
          this.width,
          this.height,
          new Position(0, 0),
        );
      }
    } else {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.item.spriteSheetPos,
      );
    }

    if (this.mouseHovering) {
      if (
        this.item instanceof TimedActiveItem &&
        !this.item.useTimer.inMotion
      ) {
        canvasManager.renderSpriteFromSheet(
          this.item.altSpriteSheet,
          this.pos,
          this.width,
          this.height,
          new Position(1, 0),
        );
      } else {
        canvasManager.renderSpriteFromSheet(
          this.sprite,
          this.pos,
          this.width,
          this.height,
          this.item.spriteSheetPos.add(1, 0),
        );
      }
    }
  }

  reset(): void {
    if (this.alt) {
      this.item = activeDict.locked;
    } else {
      this.item = this.emptyItem;
    }
  }
}
