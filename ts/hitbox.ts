import Position from "./position.js";

export default class Hitbox {
  pos: Position;
  width: number;
  height: number;

  constructor(args: { pos: Position; width: number; height: number }) {
    this.pos = args.pos;
    this.width = args.width;
    this.height = args.height;
  }

  /**
   *
   * @param targetPos
   * @returns boolean
   */
  positionInside(targetPos: Position) {
    const { pos, width, height } = this;
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
