import { canvasManager } from "../../canvasManager.js";
import Position from "../../gameElements/position.js";
import { sprites } from "../../sprites.js";
import timeTracker from "../../timer/timeTracker.js";
import { Consumable } from "./consumable.js";

export default class TimePotion extends Consumable {
  constructor() {
    super({
      spriteSheetPos: new Position(6, 0),
      name: "time_potion",
      shopName: "Time Potion",
      cost: 10,
      descriptionText: "Recover 60 seconds$tim",
    });
  }

  render(): void {
    let sheetPos = this.spriteSheetPos;
    canvasManager.renderSpriteFromSheet(
      this.sprite,
      this.pos,
      this.width,
      this.height,
      sheetPos,
    );
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        sprites.item_sheet,
        this.pos,
        16,
        16,
        this.spriteSheetPos.add(1, 0),
      );
    }
    canvasManager.renderAnimationFrame(
      sprites.time_potion_pointer_sheet,
      this.pos,
      16,
      16,
      12,
      1,
      this.firstAnimationTic,
      timeTracker.currentGameTic,
    );
    canvasManager.renderAnimationFrame(
      sprites.time_potion_pointer_sheet,
      this.pos,
      16,
      16,
      12,
      1,
      this.firstAnimationTic,
      timeTracker.currentGameTic,
      1 / 12,
      new Position(0, 1),
    );
  }
}
