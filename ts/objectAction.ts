import type { cursorState } from "./cursor.js";

export class ObjectAction {}

export class ChangeCursorState extends ObjectAction {
  newState: cursorState;
  constructor(newState: cursorState) {
    super();
    this.newState = newState;
  }
}

export class ChangeScene extends ObjectAction {
  newScene: "cave" | "shop" | "battle";
  constructor(newScene: "cave" | "shop" | "battle") {
    super();
    this.newScene = newScene;
  }
}
