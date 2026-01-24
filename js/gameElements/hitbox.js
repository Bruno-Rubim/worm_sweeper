import Position from "./position.js";
export default class Hitbox {
    objPos;
    shiftPos;
    width;
    height;
    constructor(args) {
        this.objPos = args.objPos;
        this.shiftPos = args.shiftPos ?? new Position();
        this.width = args.width;
        this.height = args.height;
    }
    positionInside(targetPos) {
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
