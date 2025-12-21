import GameObject from "../gameObject.js";
import type { inventory } from "../gameState.js";
import {
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  GAMEWIDTH,
  LEFT,
  RIGHT,
} from "../global.js";
import { ChangeScene } from "../objectAction.js";
import Position from "../position.js";

const exitBtn = new GameObject({
  spriteName: "button_exit",
  pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 16, BORDERTHICKTOP),
  clickFunction: (cursorPos: Position, button: typeof LEFT | typeof RIGHT) => {
    return new ChangeScene("cave");
  },
});

export default class Shop {
  objects: GameObject[] = [exitBtn];
  constructor(inventory: inventory) {}
}
