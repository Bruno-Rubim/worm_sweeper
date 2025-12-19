import Position from "../position.js";

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
