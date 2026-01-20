import Position from "./position.js";

// Represetns a gameObject's interaction area
export default class Hitbox {
  objPos: Position;
  shiftPos: Position;
  width: number;
  height: number;

  constructor(args: {
    objPos: Position;
    width: number;
    height: number;
    shiftPos: Position | undefined;
  }) {
    this.objPos = args.objPos;
    this.shiftPos = args.shiftPos ?? new Position();
    this.width = args.width;
    this.height = args.height;
  }

  /**
   * Checks if a given Position is inside its hitbox
   * @param targetPos
   * @returns boolean
   */
  positionInside(targetPos: Position) {
    const pos = this.objPos.add(this.shiftPos);
    const { width, height } = this;
    const { x, y } = targetPos;
    if (x < pos.x || y < pos.y) {
      return false;
    }
    const endX = pos.x + width;
    const endY = pos.y + height;
    if (x >= endX || y >= endY) {
      return false;
    }
    return true;
  }
}
