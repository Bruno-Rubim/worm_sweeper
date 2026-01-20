import Position from "../../gameElements/position.js";

export const CONTENTEMPTY = "empty";
export const CONTENTDOOREXIT = "door_exit";
export const CONTENTDOOREXITOPEN = "door_exit_open";
export const CONTENTDOORSHOP = "door_shop";
export const CONTENTDOORSHOPOPEN = "door_shop_open";
export const CONTENTWORM = "worm";
export const CONTENTWATER = "water";

type blockContent =
  | typeof CONTENTEMPTY
  | typeof CONTENTDOOREXIT
  | typeof CONTENTDOOREXITOPEN
  | typeof CONTENTDOORSHOP
  | typeof CONTENTDOORSHOPOPEN
  | typeof CONTENTWORM
  | typeof CONTENTWATER;

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
  [CONTENTWATER]: new Position(4, 2),
};

export default class Block {
  gamePos: Position; // The block's position in relation to the level
  gridPos: Position;

  content: blockContent = CONTENTEMPTY;
  hasGold: boolean = false;
  hidden = true;
  broken = false;
  marked = false;

  markerLevel = 0;
  threatLevel = 0;
  drilled = false;
  starter = false;

  cursorHovering = false;

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
    return blockSheetPos[this.content];
  }
}
