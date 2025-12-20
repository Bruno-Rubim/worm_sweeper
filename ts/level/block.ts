import Position from "../position.js";
import { findSprite } from "../sprites/findSprite.js";

export const EMPTY = "empty";
export const DOOREXIT = "door_exit";
export const DOOREXITOPEN = "door_exit_open";
export const DOORSHOP = "door_shop";
export const DOORSHOPOPEN = "door_shop_open";
export const WORM = "worm";

type blockContent =
  | typeof EMPTY
  | typeof DOOREXIT
  | typeof DOOREXITOPEN
  | typeof DOORSHOP
  | typeof DOORSHOPOPEN
  | typeof WORM;

export const blockSheet = findSprite("block_sheet");
export const blockSheetPos = {
  [DOOREXIT]: new Position(0, 0),
  [DOOREXITOPEN]: new Position(1, 0),
  [DOORSHOP]: new Position(2, 0),
  [DOORSHOPOPEN]: new Position(3, 0),
  [WORM]: new Position(4, 0),
  hidden: new Position(5, 0),
  dirt: new Position(6, 0),
  gold: new Position(7, 0),
  [EMPTY]: new Position(0, 1),
  marked: new Position(9, 1),
};

export default class Block {
  gamePos: Position;
  gridPos: Position;
  hasGold: boolean = false;
  hidden = true;
  broken = false;
  content: blockContent = EMPTY;
  starter = false;
  marked = false;
  threatLevel = 0;
  constructor(args: { gridPos: Position; gamePos: Position }) {
    this.gridPos = args.gridPos;
    this.gamePos = args.gamePos;
  }

  get sheetBlockPos(): Position {
    if (this.broken) {
      if (this.content == EMPTY) {
        return blockSheetPos[EMPTY].add(this.threatLevel, 0);
      }
      return blockSheetPos[EMPTY];
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
    return blockSheetPos[this.content];
  }
}
