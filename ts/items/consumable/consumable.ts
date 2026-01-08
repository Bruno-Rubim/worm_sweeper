import CanvasManager from "../../canvasManager.js";
import { GAMEWIDTH } from "../../global.js";
import { ConsumeItem } from "../../action.js";
import Position from "../../position.js";
import { sprites } from "../../sprites.js";
import timeTracker from "../../timer/timeTracker.js";
import { Item } from "../item.js";

export class Consumable extends Item {
  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    description: string;
  }) {
    super({ ...args, pos: new Position(GAMEWIDTH - 20, 72) });
    this.clickFunction = () => {
      return new ConsumeItem(this.name);
    };
  }
}

const time_potion = new Consumable({
  spriteSheetPos: new Position(6, 0),
  name: "time_potion",
  shopName: "Time Potion",
  cost: 10,
  description: "Recover 60 seconds$tim",
});

time_potion.render = (canvasManager: CanvasManager) => {
  let sheetPos = consumableDic.time_potion.spriteSheetPos;
  canvasManager.renderSpriteFromSheet(
    consumableDic.time_potion.sprite,
    consumableDic.time_potion.pos,
    consumableDic.time_potion.width,
    consumableDic.time_potion.height,
    sheetPos
  );
  if (time_potion.mouseHovering) {
    canvasManager.renderSpriteFromSheet(
      sprites.item_sheet,
      time_potion.pos,
      16,
      16,
      time_potion.spriteSheetPos.add(1, 0)
    );
  }
  canvasManager.renderAnimationFrame(
    sprites.time_potion_pointer_sheet,
    consumableDic.time_potion.pos,
    16,
    16,
    12,
    1,
    consumableDic.time_potion.firstAnimationTic,
    timeTracker.currentGameTic
  );
  canvasManager.renderAnimationFrame(
    sprites.time_potion_pointer_sheet,
    consumableDic.time_potion.pos,
    16,
    16,
    12,
    1,
    consumableDic.time_potion.firstAnimationTic,
    timeTracker.currentGameTic,
    1 / 12,
    new Position(0, 1)
  );
};

export const consumableDic = {
  bomb: new Consumable({
    spriteSheetPos: new Position(0, 0),
    name: "bomb",
    shopName: "Bomb",
    cost: 13,
    description:
      "Use on an empty block to break blocks and kill worms or in battle to deal 5 damage.",
  }),
  health_potion_big: new Consumable({
    spriteSheetPos: new Position(2, 0),
    name: "health_potion_big",
    shopName: "Big Health Potion",
    cost: 12,
    description: "Gain 2 hearts.",
  }),
  health_potion: new Consumable({
    spriteSheetPos: new Position(4, 0),
    name: "health_potion",
    shopName: "Health Potion",
    cost: 7,
    description: "Gain 1 heart.",
  }),
  health_vial: new Consumable({
    spriteSheetPos: new Position(8, 0),
    name: "health_vial",
    shopName: "Health Vial",
    cost: 4,
    description: "Gain 0.5 hearts.",
  }),
  time_potion: time_potion,
  empty: new Consumable({
    spriteSheetPos: new Position(14, 0),
    name: "empty",
    shopName: "",
    cost: 0,
    description: "",
  }),
};
