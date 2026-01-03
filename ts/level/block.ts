import Position from "../position.js";
import { Timer } from "../timer/timer.js";

export const CONTENTEMPTY = "empty";
export const CONTENTDOOREXIT = "door_exit";
export const CONTENTDOOREXITOPEN = "door_exit_open";
export const CONTENTDOORSHOP = "door_shop";
export const CONTENTDOORSHOPOPEN = "door_shop_open";
export const CONTENTBOMB = "bomb";
export const CONTENTBOMBOVERLAY = "bomb_overlay";
export const CONTENTWORM = "worm";

type blockContent =
  | typeof CONTENTEMPTY
  | typeof CONTENTDOOREXIT
  | typeof CONTENTDOOREXITOPEN
  | typeof CONTENTDOORSHOP
  | typeof CONTENTDOORSHOPOPEN
  | typeof CONTENTWORM
  | typeof CONTENTBOMBOVERLAY
  | typeof CONTENTBOMB;

export const blockSheetPos = {
  [CONTENTDOOREXIT]: new Position(0, 0),
  [CONTENTDOOREXITOPEN]: new Position(1, 0),
  [CONTENTDOORSHOP]: new Position(2, 0),
  [CONTENTDOORSHOPOPEN]: new Position(3, 0),
  [CONTENTWORM]: new Position(4, 0),
  hidden: new Position(5, 0),
  dirt: new Position(6, 0),
  gold: new Position(7, 0),
  [CONTENTEMPTY]: new Position(0, 1),
  bell: new Position(9, 0),
  marked: new Position(9, 1),
  [CONTENTBOMBOVERLAY]: new Position(0, 2),
  [CONTENTBOMB]: new Position(1, 2),
};

export default class Block {
  gamePos: Position;
  gridPos: Position;
  hasGold: boolean = false;
  hidden = true;
  broken = false;
  content: blockContent = CONTENTEMPTY;
  starter = false;
  marked = false;
  drilled = false;
  threatLevel = 0;
  markerLevel = 0;
  bombTimer: Timer | null = null;
  constructor(args: { gridPos: Position; gamePos: Position }) {
    this.gridPos = args.gridPos;
    this.gamePos = args.gamePos;
  }

  get sheetBlockPos(): Position {
    if (this.broken) {
      if (this.content == CONTENTEMPTY) {
        return blockSheetPos[CONTENTEMPTY].add(this.threatLevel, 0);
      }
      return blockSheetPos[CONTENTEMPTY];
    }
    if (this.hidden) {
      return blockSheetPos.hidden;
    }
    if (this.hasGold) {
      return blockSheetPos.gold;
    }
    return blockSheetPos.dirt;
  }

  get sheetContentPos(): Position {
    if (this.marked) {
      return blockSheetPos.marked;
    }
    if (this.bombTimer instanceof Timer) {
      return blockSheetPos.bomb.add(
        Math.min(2, Math.floor(this.bombTimer.percentage / ((1 / 3) * 100))),
        0
      );
    }
    return blockSheetPos[this.content];
  }
}
