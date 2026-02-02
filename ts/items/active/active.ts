import type { Action } from "../../action.js";
import Position from "../../gameElements/position.js";
import type { Sprite } from "../../sprites.js";
import { Timer } from "../../timer/timer.js";
import { GAMETIMERSYNC } from "../../timer/timerManager.js";
import { Item } from "../item.js";

export class ActiveItem extends Item {
  constructor(args: {
    isAlt?: boolean;
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    descriptionText?: string;
  }) {
    super({ ...args });
  }

  get finalCost(): number {
    return this.cost;
  }
}

export class TimedActiveItem extends ActiveItem {
  useTimer: Timer;
  altSpriteSheet: Sprite;

  constructor(args: {
    spriteSheetPos: Position;
    altSpriteSheet: Sprite;
    name: string;
    shopName: string;
    cost: number;
    descriptionText: string;
    cooldown: number;
    goalFunc?: () => Action | void | null;
  }) {
    super(args);
    this.useTimer = new Timer({
      goalSecs: args.cooldown,
      goalFunc: args.goalFunc,
      autoStart: false,
      classes: [GAMETIMERSYNC],
    });
    this.altSpriteSheet = args.altSpriteSheet;
  }
}
