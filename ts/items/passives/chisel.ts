import { PickupChisel } from "../../action.js";
import type { cursorClick } from "../../global.js";
import Position from "../../position.js";
import { GAMETIMERSYNC, Timer } from "../../timer/timer.js";
import { Item } from "../item.js";

export class Chisel extends Item {
  using = false;
  chiselTimer = new Timer({
    goalSecs: 3,
    classes: [GAMETIMERSYNC],
    deleteAtEnd: true,
  });

  constructor(pos?: Position) {
    super({
      pos: pos ?? new Position(),
      spriteSheetPos: new Position(0, 5),
      name: "chisel",
      shopName: "Chisel",
      cost: 6,
      descriptionText:
        "Use this to carve out gold from a block wihtout breaking it.",
    });
  }

  clickFunction = (cursorPos: Position, button: cursorClick) => {
    if (!this.chiselTimer.inMotion) {
      return new PickupChisel(this);
    }
  };

  clone(): Chisel {
    return new Chisel(new Position().add(this.pos));
  }
}
