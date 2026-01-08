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
        "Use on an empty block to break blocks and kill worms or in battle to deal 5 damage.",
    });
  }

  clickFunction = (cursorPos: Position, button: cursorClick) => {
    return new PickupBomb(this);
  };
}
