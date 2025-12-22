import Position from "./position.js";

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
   *
   * @param targetPos
   * @returns boolean
   */
  positionInside(targetPos: Position) {
    const pos = this.objPos.addPos(this.shiftPos);
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

  getPos() {
    console.log(this.objPos);
    return this.objPos.addPos(this.shiftPos);
  }
}
