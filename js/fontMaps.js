import Position from "./gameElements/position.js";
import { sprites } from "./sprites.js";
import { utils } from "./utils.js";
export const fontMaps = {
    shop_description: {
        spriteSheet: sprites.letters_shop_description,
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
            "-": {
                pos: new Position(12, 1),
                width: 4,
            },
            "+": {
                pos: new Position(13, 1),
                width: 7,
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
            "%": {
                pos: new Position(12, 3),
                width: 7,
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
            "'": {
                pos: new Position(12, 4),
                width: 2,
            },
            ",": {
                pos: new Position(13, 4),
                width: 3,
            },
            "!": {
                pos: new Position(0, 5),
                width: 3,
            },
            " ": {
                pos: new Position(13, 8),
                width: 3,
            },
        },
    },
    description: {
        spriteSheet: sprites.letters_description,
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
            "-": {
                pos: new Position(12, 1),
                width: 4,
            },
            "+": {
                pos: new Position(13, 1),
                width: 7,
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
            "%": {
                pos: new Position(12, 3),
                width: 7,
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
            "'": {
                pos: new Position(12, 4),
                width: 2,
            },
            ",": {
                pos: new Position(13, 4),
                width: 3,
            },
            "!": {
                pos: new Position(0, 5),
                width: 3,
            },
            " ": {
                pos: new Position(13, 8),
                width: 3,
            },
        },
    },
    book: {
        spriteSheet: sprites.letters_book,
        cellHeight: 10,
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
            "-": {
                pos: new Position(12, 1),
                width: 4,
            },
            "+": {
                pos: new Position(13, 1),
                width: 7,
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
            "%": {
                pos: new Position(12, 3),
                width: 7,
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
            "'": {
                pos: new Position(12, 4),
                width: 2,
            },
            ",": {
                pos: new Position(13, 4),
                width: 3,
            },
            "!": {
                pos: new Position(0, 5),
                width: 3,
            },
            " ": {
                pos: new Position(13, 8),
                width: 3,
            },
        },
    },
    numbers_yellow: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_red: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_lime: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_green: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_gray: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_blue: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_brown: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_gold: {
        spriteSheet: sprites.number_sheet,
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
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    numbers_cost: {
        spriteSheet: sprites.number_sheet,
        cellHeight: 8,
        cellWidth: 8,
        charMaps: {
            0: {
                width: 7,
                pos: new Position(0, 8),
            },
            1: {
                width: 7,
                pos: new Position(1, 8),
            },
            2: {
                width: 7,
                pos: new Position(2, 8),
            },
            3: {
                width: 7,
                pos: new Position(3, 8),
            },
            4: {
                width: 7,
                pos: new Position(4, 8),
            },
            5: {
                width: 7,
                pos: new Position(5, 8),
            },
            6: {
                width: 7,
                pos: new Position(6, 8),
            },
            7: {
                width: 7,
                pos: new Position(7, 8),
            },
            8: {
                width: 7,
                pos: new Position(8, 8),
            },
            9: {
                width: 7,
                pos: new Position(9, 8),
            },
            ".": {
                width: 4,
                pos: new Position(10, 8),
            },
            "-": {
                width: 7,
                pos: new Position(11, 8),
            },
            " ": {
                width: 0,
                pos: new Position(-1, -1),
            },
        },
    },
    icons: {
        spriteSheet: sprites.icon_sheet,
        cellHeight: 9,
        cellWidth: 9,
        charMaps: {
            $wrm: {
                pos: new Position(0, 0),
                width: 9,
            },
            $gld: {
                pos: new Position(1, 0),
                width: 9,
            },
            $dor: {
                pos: new Position(2, 0),
                width: 9,
            },
            $blk: {
                pos: new Position(3, 0),
                width: 9,
            },
            $tim: {
                pos: new Position(4, 0),
                width: 9,
            },
            $skl: {
                pos: new Position(5, 0),
                width: 9,
            },
            $slw: {
                pos: new Position(0, 1),
                width: 9,
            },
            $spd: {
                pos: new Position(1, 1),
                width: 9,
            },
            $dmg: {
                pos: new Position(2, 1),
                width: 9,
            },
            $hrt: {
                pos: new Position(0, 2),
                width: 9,
            },
            $dfs: {
                pos: new Position(1, 2),
                width: 9,
            },
            $pro: {
                pos: new Position(2, 2),
                width: 9,
            },
            $ref: {
                pos: new Position(3, 2),
                width: 9,
            },
            $spk: {
                pos: new Position(4, 2),
                width: 9,
            },
            $stn: {
                pos: new Position(5, 2),
                width: 9,
            },
            $hhr: {
                pos: new Position(0, 3),
                width: 9,
            },
            $hdf: {
                pos: new Position(1, 3),
                width: 9,
            },
            $hpr: {
                pos: new Position(2, 3),
                width: 9,
            },
            $hrf: {
                pos: new Position(3, 3),
                width: 9,
            },
            $hsp: {
                pos: new Position(4, 3),
                width: 9,
            },
            $hst: {
                pos: new Position(5, 3),
                width: 9,
            },
            " ": {
                pos: new Position(-1, -1),
                width: 3,
            },
        },
    },
};
export function measureTextWidth(font, text) {
    let width = 0;
    let chars = text.split("");
    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        if (char == "$") {
            char = chars.slice(i, i + 4).join("");
            i += 3;
            width += fontMaps["icons"]?.charMaps[char]?.width ?? 0;
        }
        else {
            width += fontMaps[font]?.charMaps[char]?.width ?? 0;
        }
    }
    return width;
}
export function measureTextBoxHeight(font, text, limitWidth, fontSize = 1) {
    if (utils.lastOfArray(text.split("")) == "\n") {
        text = text.slice(0, text.length - 2);
    }
    const fontMap = fontMaps[font];
    const words = text.split(" ");
    let height = fontMap.cellHeight * fontSize;
    let currentLineWidth = 0;
    words.forEach((word, i) => {
        let iconLength = 0;
        if (word[0] == "$") {
            word = word.slice(4, word.length - 1);
            iconLength = 9 * fontSize;
        }
        if (word.includes("\n")) {
            const breakWords = word.split("\n");
            const firstWidth = measureTextWidth(font, breakWords[0]) * fontSize;
            const lastWidth = measureTextWidth(font, utils.lastOfArray(breakWords)) * fontSize;
            if (currentLineWidth + firstWidth > limitWidth) {
                words[i] = "\n" + words[i];
            }
            currentLineWidth = lastWidth;
            height += fontMap.cellHeight * fontSize;
            return;
        }
        const wordWidth = measureTextWidth(font, word) * fontSize;
        if (currentLineWidth + wordWidth + iconLength > limitWidth) {
            height += fontMap.cellHeight * fontSize;
            currentLineWidth =
                wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
        }
        else {
            currentLineWidth +=
                wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
        }
    });
    return height;
}
