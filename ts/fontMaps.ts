import Position from "./position.js";

type charMap = {
  pos: Position;
  width: number;
};

type fontMap = {
  cellWidth: number;
  cellHeight: number;
  charMaps: Record<string, charMap>;
};

export const fontMaps: Record<string, fontMap> = {
  shop_description: {
    cellHeight: 9,
    cellWidth: 9,
    charMaps: {
      A: {
        pos: new Position(0, 0),
        width: 6,
      },
      B: {
        pos: new Position(1, 0),
        width: 6,
      },
      C: {
        pos: new Position(2, 0),
        width: 6,
      },
      D: {
        pos: new Position(3, 0),
        width: 6,
      },
      E: {
        pos: new Position(4, 0),
        width: 6,
      },
      F: {
        pos: new Position(5, 0),
        width: 6,
      },
      G: {
        pos: new Position(6, 0),
        width: 6,
      },
      H: {
        pos: new Position(7, 0),
        width: 6,
      },
      I: {
        pos: new Position(8, 0),
        width: 3,
      },
      J: {
        pos: new Position(9, 0),
        width: 5,
      },
      K: {
        pos: new Position(10, 0),
        width: 7,
      },
      L: {
        pos: new Position(11, 0),
        width: 5,
      },
      M: {
        pos: new Position(12, 0),
        width: 8,
      },
      N: {
        pos: new Position(13, 0),
        width: 7,
      },
      O: {
        pos: new Position(0, 1),
        width: 7,
      },
      P: {
        pos: new Position(1, 1),
        width: 6,
      },
      Q: {
        pos: new Position(2, 1),
        width: 7,
      },
      R: {
        pos: new Position(3, 1),
        width: 6,
      },
      S: {
        pos: new Position(4, 1),
        width: 5,
      },
      T: {
        pos: new Position(5, 1),
        width: 7,
      },
      U: {
        pos: new Position(6, 1),
        width: 6,
      },
      V: {
        pos: new Position(7, 1),
        width: 7,
      },
      W: {
        pos: new Position(8, 1),
        width: 8,
      },
      X: {
        pos: new Position(9, 1),
        width: 7,
      },
      Y: {
        pos: new Position(10, 1),
        width: 7,
      },
      Z: {
        pos: new Position(11, 1),
        width: 6,
      },
      a: {
        pos: new Position(0, 2),
        width: 6,
      },
      b: {
        pos: new Position(1, 2),
        width: 6,
      },
      c: {
        pos: new Position(2, 2),
        width: 5,
      },
      d: {
        pos: new Position(3, 2),
        width: 6,
      },
      e: {
        pos: new Position(4, 2),
        width: 6,
      },
      f: {
        pos: new Position(5, 2),
        width: 4,
      },
      g: {
        pos: new Position(6, 2),
        width: 6,
      },
      h: {
        pos: new Position(7, 2),
        width: 6,
      },
      i: {
        pos: new Position(8, 2),
        width: 3,
      },
      j: {
        pos: new Position(9, 2),
        width: 4,
      },
      k: {
        pos: new Position(10, 2),
        width: 6,
      },
      l: {
        pos: new Position(11, 2),
        width: 3,
      },
      m: {
        pos: new Position(12, 2),
        width: 9,
      },
      n: {
        pos: new Position(13, 2),
        width: 6,
      },
      o: {
        pos: new Position(0, 3),
        width: 6,
      },
      p: {
        pos: new Position(1, 3),
        width: 6,
      },
      q: {
        pos: new Position(2, 3),
        width: 6,
      },
      r: {
        pos: new Position(3, 3),
        width: 5,
      },
      s: {
        pos: new Position(4, 3),
        width: 5,
      },
      t: {
        pos: new Position(5, 3),
        width: 4,
      },
      u: {
        pos: new Position(6, 3),
        width: 6,
      },
      v: {
        pos: new Position(7, 3),
        width: 6,
      },
      w: {
        pos: new Position(8, 3),
        width: 8,
      },
      x: {
        pos: new Position(9, 3),
        width: 6,
      },
      y: {
        pos: new Position(10, 3),
        width: 6,
      },
      z: {
        pos: new Position(11, 3),
        width: 6,
      },
      0: {
        pos: new Position(0, 4),
        width: 6,
      },
      1: {
        pos: new Position(1, 4),
        width: 4,
      },
      2: {
        pos: new Position(2, 4),
        width: 6,
      },
      3: {
        pos: new Position(3, 4),
        width: 6,
      },
      4: {
        pos: new Position(4, 4),
        width: 6,
      },
      5: {
        pos: new Position(5, 4),
        width: 6,
      },
      6: {
        pos: new Position(6, 4),
        width: 6,
      },
      7: {
        pos: new Position(7, 4),
        width: 6,
      },
      8: {
        pos: new Position(8, 4),
        width: 6,
      },
      9: {
        pos: new Position(9, 4),
        width: 6,
      },
      ":": {
        pos: new Position(10, 4),
        width: 3,
      },
      ".": {
        pos: new Position(11, 4),
        width: 3,
      },
      " ": {
        pos: new Position(13, 8),
        width: 3,
      },
    },
  },
  numbers_yellow: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 0),
      },
      1: {
        width: 7,
        pos: new Position(1, 0),
      },
      2: {
        width: 7,
        pos: new Position(2, 0),
      },
      3: {
        width: 7,
        pos: new Position(3, 0),
      },
      4: {
        width: 7,
        pos: new Position(4, 0),
      },
      5: {
        width: 7,
        pos: new Position(5, 0),
      },
      6: {
        width: 7,
        pos: new Position(6, 0),
      },
      7: {
        width: 7,
        pos: new Position(7, 0),
      },
      8: {
        width: 7,
        pos: new Position(8, 0),
      },
      9: {
        width: 7,
        pos: new Position(9, 0),
      },
      ".": {
        width: 4,
        pos: new Position(10, 0),
      },
      "-": {
        width: 7,
        pos: new Position(11, 0),
      },
    },
  },
  numbers_red: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 1),
      },
      1: {
        width: 7,
        pos: new Position(1, 1),
      },
      2: {
        width: 7,
        pos: new Position(2, 1),
      },
      3: {
        width: 7,
        pos: new Position(3, 1),
      },
      4: {
        width: 7,
        pos: new Position(4, 1),
      },
      5: {
        width: 7,
        pos: new Position(5, 1),
      },
      6: {
        width: 7,
        pos: new Position(6, 1),
      },
      7: {
        width: 7,
        pos: new Position(7, 1),
      },
      8: {
        width: 7,
        pos: new Position(8, 1),
      },
      9: {
        width: 7,
        pos: new Position(9, 1),
      },
      ".": {
        width: 4,
        pos: new Position(10, 1),
      },
      "-": {
        width: 7,
        pos: new Position(11, 1),
      },
    },
  },
  numbers_lime: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 2),
      },
      1: {
        width: 7,
        pos: new Position(1, 2),
      },
      2: {
        width: 7,
        pos: new Position(2, 2),
      },
      3: {
        width: 7,
        pos: new Position(3, 2),
      },
      4: {
        width: 7,
        pos: new Position(4, 2),
      },
      5: {
        width: 7,
        pos: new Position(5, 2),
      },
      6: {
        width: 7,
        pos: new Position(6, 2),
      },
      7: {
        width: 7,
        pos: new Position(7, 2),
      },
      8: {
        width: 7,
        pos: new Position(8, 2),
      },
      9: {
        width: 7,
        pos: new Position(9, 2),
      },
      ".": {
        width: 4,
        pos: new Position(10, 2),
      },
      "-": {
        width: 7,
        pos: new Position(11, 2),
      },
    },
  },
  numbers_green: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 3),
      },
      1: {
        width: 7,
        pos: new Position(1, 3),
      },
      2: {
        width: 7,
        pos: new Position(2, 3),
      },
      3: {
        width: 7,
        pos: new Position(3, 3),
      },
      4: {
        width: 7,
        pos: new Position(4, 3),
      },
      5: {
        width: 7,
        pos: new Position(5, 3),
      },
      6: {
        width: 7,
        pos: new Position(6, 3),
      },
      7: {
        width: 7,
        pos: new Position(7, 3),
      },
      8: {
        width: 7,
        pos: new Position(8, 3),
      },
      9: {
        width: 7,
        pos: new Position(9, 3),
      },
      ".": {
        width: 4,
        pos: new Position(10, 3),
      },
      "-": {
        width: 7,
        pos: new Position(11, 3),
      },
    },
  },
  numbers_gray: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 4),
      },
      1: {
        width: 7,
        pos: new Position(1, 4),
      },
      2: {
        width: 7,
        pos: new Position(2, 4),
      },
      3: {
        width: 7,
        pos: new Position(3, 4),
      },
      4: {
        width: 7,
        pos: new Position(4, 4),
      },
      5: {
        width: 7,
        pos: new Position(5, 4),
      },
      6: {
        width: 7,
        pos: new Position(6, 4),
      },
      7: {
        width: 7,
        pos: new Position(7, 4),
      },
      8: {
        width: 7,
        pos: new Position(8, 4),
      },
      9: {
        width: 7,
        pos: new Position(9, 4),
      },
      ".": {
        width: 4,
        pos: new Position(10, 4),
      },
      "-": {
        width: 7,
        pos: new Position(11, 4),
      },
    },
  },
  numbers_blue: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 5),
      },
      1: {
        width: 7,
        pos: new Position(1, 5),
      },
      2: {
        width: 7,
        pos: new Position(2, 5),
      },
      3: {
        width: 7,
        pos: new Position(3, 5),
      },
      4: {
        width: 7,
        pos: new Position(4, 5),
      },
      5: {
        width: 7,
        pos: new Position(5, 5),
      },
      6: {
        width: 7,
        pos: new Position(6, 5),
      },
      7: {
        width: 7,
        pos: new Position(7, 5),
      },
      8: {
        width: 7,
        pos: new Position(8, 5),
      },
      9: {
        width: 7,
        pos: new Position(9, 5),
      },
      ".": {
        width: 4,
        pos: new Position(10, 5),
      },
      "-": {
        width: 7,
        pos: new Position(11, 5),
      },
    },
  },
  numbers_brown: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 6),
      },
      1: {
        width: 7,
        pos: new Position(1, 6),
      },
      2: {
        width: 7,
        pos: new Position(2, 6),
      },
      3: {
        width: 7,
        pos: new Position(3, 6),
      },
      4: {
        width: 7,
        pos: new Position(4, 6),
      },
      5: {
        width: 7,
        pos: new Position(5, 6),
      },
      6: {
        width: 7,
        pos: new Position(6, 6),
      },
      7: {
        width: 7,
        pos: new Position(7, 6),
      },
      8: {
        width: 7,
        pos: new Position(8, 6),
      },
      9: {
        width: 7,
        pos: new Position(9, 6),
      },
      ".": {
        width: 4,
        pos: new Position(10, 6),
      },
      "-": {
        width: 7,
        pos: new Position(11, 6),
      },
    },
  },
  numbers_gold: {
    cellHeight: 8,
    cellWidth: 8,
    charMaps: {
      0: {
        width: 7,
        pos: new Position(0, 7),
      },
      1: {
        width: 7,
        pos: new Position(1, 7),
      },
      2: {
        width: 7,
        pos: new Position(2, 7),
      },
      3: {
        width: 7,
        pos: new Position(3, 7),
      },
      4: {
        width: 7,
        pos: new Position(4, 7),
      },
      5: {
        width: 7,
        pos: new Position(5, 7),
      },
      6: {
        width: 7,
        pos: new Position(6, 7),
      },
      7: {
        width: 7,
        pos: new Position(7, 7),
      },
      8: {
        width: 7,
        pos: new Position(8, 7),
      },
      9: {
        width: 7,
        pos: new Position(9, 7),
      },
      ".": {
        width: 4,
        pos: new Position(10, 7),
      },
      "-": {
        width: 7,
        pos: new Position(11, 7),
      },
    },
  },
};
