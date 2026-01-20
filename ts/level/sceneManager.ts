import type { Action } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import {
  BORDERTHICKLEFT,
  BORDERTHICKTOP,
  type CLICKLEFT,
  type CLICKRIGHT,
} from "../global.js";
import Position from "../gameElements/position.js";

// Abstract class. Manages rendering and interactions with a scene in the level
export default class SceneManager {
  pos: Position;

  handleHover: (cursorPos: Position) => Action | void;
  handleNotHover: () => Action | void;
  handleHeld: (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT,
  ) => Action | void;
  handleClick: (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT,
  ) => Action | void;
  /**
   * Renders the screen based on the gameState
   */
  render: () => void;
  constructor() {
    this.pos = new Position(BORDERTHICKLEFT, BORDERTHICKTOP);
    this.handleHover = () => {};
    this.handleNotHover = () => {};
    this.handleHeld = () => {};
    this.handleClick = () => {};
    this.render = () => {};
  }
}
