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
  pos: Position;
  hasGold: boolean;
  hidden = true;
  broken = false;
  content: blockContent = EMPTY;
  starter = false;
  marker = null;
  threatLevel = 0;
  constructor(args: { pos: Position; hasGold?: boolean }) {
    this.pos = args.pos;
    this.hasGold = Boolean(args.hasGold);
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
