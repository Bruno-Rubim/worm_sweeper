import Position from "../position.js";

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

  get sheetPos(): Position {
    if (this.broken) {
      return new Position(0, 0);
    }
    if (this.hidden) {
      return new Position(1, 0);
    }
    if (this.hasGold) {
      return new Position(3, 0);
    }
    return new Position(2, 0);
  }
}
