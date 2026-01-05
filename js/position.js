export default class Position {
    x = 0;
    y = 0;
    constructor(x, y) {
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
    addPos(pos) {
        return new Position(this.x + pos.x, this.y + pos.y);
    }
    subtractPos(pos) {
        return new Position(this.x - pos.x, this.y - pos.y);
    }
    add(x, y) {
        return new Position(this.x + x, this.y + y);
    }
    subtract(x, y) {
        return new Position(this.x - x, this.y - y);
    }
    multiply(x, y) {
        return new Position(this.x * x, this.y * (y ?? x));
    }
    divide(x, round = true) {
        if (round) {
            return new Position(Math.floor(this.x / x), Math.floor(this.y / x));
        }
        return new Position(this.x / x, this.y / x);
    }
}
