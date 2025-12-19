import type { cursorState } from "./cursor.js";

export class ObjectAction {}

export class ChangeCursorState extends ObjectAction {
  newState: cursorState;
  constructor(newState: cursorState) {
    super();
    this.newState = newState;
  }
}
