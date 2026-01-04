import type { Action } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import type GameState from "../gameState.js";
import type { CLICKLEFT, CLICKRIGHT } from "../global.js";
import type Position from "../position.js";
import type { SoundManager } from "../soundManager.js";

export default class SceneManager {
  handleHover: (cursorPos: Position) => Action | void;
  handleHeld: (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => Action | void;
  handleClick: (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => Action | void;
  render: (canvasManager: CanvasManager) => void;
  gameState: GameState;
  pos: Position;
  soundManager: SoundManager;
  constructor(
    gameState: GameState,
    scenePos: Position,
    soundManager: SoundManager
  ) {
    this.gameState = gameState;
    this.pos = scenePos;
    this.soundManager = soundManager;
    this.handleHover = () => {};
    this.handleHeld = () => {};
    this.handleClick = () => {};
    this.render = () => {};
  }
}
