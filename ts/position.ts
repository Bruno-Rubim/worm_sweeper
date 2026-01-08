// Class of a 2d position in game. Used to track where the cursor and gameObjects are at in the game
export default class Position {
  x: number = 0;
  y: number = 0;

  constructor(x?: number | Position, y?: number) {
    if (x instanceof Position) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  /**
   * Updates x and y values with another Position's values or 2 new values
   * @param x number | Position
   * @param y? number
   * @returns
   */
  update(x: number | Position, y?: number) {
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

  /**
   * Adds both x and y by two given numbers or by the x and y of a given Position
   * @param x number | Position
   * @param y? number
   * @returns
   */
  add(x: number | Position, y?: number) {
    y ??= 0;
    if (x instanceof Position) {
      return new Position(this.x + x.x, this.y + x.y);
    }
    return new Position(this.x + x, this.y + y);
  }

  /**
   * Subtracts both x and y by two given numbers or by the x and y of a given Position
   * @param x number | Position
   * @param y? number
   * @returns
   */
  subtract(x: number | Position, y?: number) {
    y ??= 0;
    if (x instanceof Position) {
      return new Position(this.x - x.x, this.y - x.y);
    }
    return new Position(this.x - x, this.y - y);
  }

  /**
   * Multiplies both x and y by a given multiplier
   * @param multiplier
   * @returns
   */
  multiply(multiplier: number) {
    return new Position(this.x * multiplier, this.y * multiplier);
  }

  /**
   * Divides both x and y by a given divisor, can be rounded
   * @param divisor number
   * @param round boolean = true
   * @returns
   */
  divide(divisor: number, round: boolean = true) {
    if (round) {
      return new Position(
        Math.floor(this.x / divisor),
        Math.floor(this.y / divisor)
      );
    }
    return new Position(this.x / divisor, this.y / divisor);
  }
}
