import { ItemDescription, ObtainItem } from "../../action.js";
import Position from "../../gameElements/position.js";
import { CENTER, GAMEWIDTH, type cursorClick } from "../../global.js";
import { Slot } from "../../inventory/slot.js";
import { soundManager } from "../../sounds/soundManager.js";
import sounds from "../../sounds/sounds.js";

export default class LootSlot extends Slot {
  constructor() {
    super(new Position(GAMEWIDTH / 2 - 8, 36));
    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      const item = this.item;
      this.item = this.emptyItem;
      soundManager.playSound(sounds.clear);
      return new ObtainItem(item);
    };
    this.hoverFunction = (cursorPos: Position) => {
      if (this.item.description) {
        return new ItemDescription(
          this.item.description,
          CENTER,
          this.item.descFontSize,
        );
      }
    };
  }
}
