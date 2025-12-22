export default class Position {
  x: number = 0;
  y: number = 0;

  constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  update(x: number | Position, y: number) {
    if (x instanceof Position) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @param pos
   * @returns
   */
  addPos(pos: Position) {
    return new Position(this.x + pos.x, this.y + pos.y);
  }

  /**
   *
   * @param pos
   * @returns
   */
  subtractPos(pos: Position) {
    return new Position(this.x - pos.x, this.y - pos.y);
  }

  /**
   *
   * @param x
   * @param y
   * @returns
   */
  add(x: number, y: number) {
    return new Position(this.x + x, this.y + y);
  }

  /**
   *
   * @param x
   * @param y
   * @returns
   */
  subtract(x: number, y: number) {
    return new Position(this.x - x, this.y - y);
  }

  /**
   *
   * @param x
   * @param y
   * @returns
   */
  multiply(x: number, y?: number) {
    return new Position(this.x * x, this.y * (y ?? x));
  }

  /**
   *
   * @param x
   * @param y
   * @returns
   */
  divide(x: number, round: boolean = true) {
    if (round) {
      return new Position(Math.floor(this.x / x), Math.floor(this.y / x));
    }
    return new Position(this.x / x, this.y / x);
  }
}
