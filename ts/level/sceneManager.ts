import type { Action } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import type GameState from "../gameState.js";
import type { CLICKLEFT, CLICKRIGHT } from "../global.js";
import type Position from "../position.js";
import type { SoundManager } from "../soundManager.js";

// Abstract class. Manages rendering and interactions with a scene in the level
export default class SceneManager {
  gameState: GameState;
  pos: Position;
  soundManager: SoundManager;

  handleHover: (cursorPos: Position) => Action | void;
  handleNotHover: () => Action | void;
  handleHeld: (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => Action | void;
  handleClick: (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => Action | void;
  /**
   * Renders the screen based on the gameState
   */
  render: (canvasManager: CanvasManager) => void;
  constructor(
    gameState: GameState,
    scenePos: Position,
    soundManager: SoundManager
  ) {
    this.gameState = gameState;
    this.pos = scenePos;
    this.soundManager = soundManager;
    this.handleHover = () => {};
    this.handleNotHover = () => {};
    this.handleHeld = () => {};
    this.handleClick = () => {};
    this.render = () => {};
  }
}
