import Position from "../position.js";
import { sprites } from "../sprite.js";
export const CONTENTEMPTY = "empty";
export const CONTENTDOOREXIT = "door_exit";
export const CONTENTDOOREXITOPEN = "door_exit_open";
export const CONTENTDOORSHOP = "door_shop";
export const CONTENTDOORSHOPOPEN = "door_shop_open";
export const CONTENTWORM = "worm";
export const blockSheet = sprites.block_sheet;
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
};
export default class Block {
    gamePos;
    gridPos;
    hasGold = false;
    hidden = true;
    broken = false;
    content = CONTENTEMPTY;
    starter = false;
    marked = false;
    drilled = false;
    threatLevel = 0;
    markerLevel = 0;
    constructor(args) {
        this.gridPos = args.gridPos;
        this.gamePos = args.gamePos;
    }
    get sheetBlockPos() {
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
    get sheetContentPos() {
        if (this.marked) {
            return blockSheetPos.marked;
        }
        return blockSheetPos[this.content];
    }
}
