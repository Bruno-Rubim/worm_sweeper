import { PickupBomb } from "../../action.js";
import type { cursorClick } from "../../global.js";
import Position from "../../position.js";
import { GAMETIMERSYNC, Timer } from "../../timer/timer.js";
import { Consumable } from "./consumable.js";

export default class Bomb extends Consumable {
  timer = new Timer({
    goalSecs: 3,
    classes: [GAMETIMERSYNC],
    deleteAtEnd: true,
  });
  constructor() {
    super({
      spriteSheetPos: new Position(0, 0),
      name: "bomb",
      shopName: "Bomb",
      cost: 13,
      descriptionText:
        "Deal 5 damage or use on any block to destroy blocks around it, along with worms and gold.",
    });
  }

  clickFunction = (cursorPos: Position, button: cursorClick) => {
    return new PickupBomb(this);
  };
}
