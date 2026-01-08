export default class Position {
    x = 0;
    y = 0;
    constructor(x, y) {
        if (x instanceof Position) {
            this.x = x.x;
            this.y = x.y;
            return;
        }
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
    update(x, y) {
        if (x instanceof Position) {
            this.x = x.x;
            this.y = x.y;
            return;
        }
        if (y == undefined) {
            return;
        }
        this.x = x;
        this.y = y;
    }
    add(x, y) {
        y ??= 0;
        if (x instanceof Position) {
            return new Position(this.x + x.x, this.y + x.y);
        }
        return new Position(this.x + x, this.y + y);
    }
    subtract(x, y) {
        y ??= 0;
        if (x instanceof Position) {
            return new Position(this.x - x.x, this.y - x.y);
        }
        return new Position(this.x - x, this.y - y);
    }
    multiply(multiplier) {
        return new Position(this.x * multiplier, this.y * multiplier);
    }
    divide(divisor, round = true) {
        if (round) {
            return new Position(Math.floor(this.x / divisor), Math.floor(this.y / divisor));
        }
        return new Position(this.x / divisor, this.y / divisor);
    }
}
