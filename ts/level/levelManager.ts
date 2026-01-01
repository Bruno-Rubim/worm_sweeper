import CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";
import type GameState from "../gameState.js";
import {
  BORDERTHICKLEFT,
  BORDERTHICKTOP,
  CLICKLEFT,
  CLICKRIGHT,
  type cursorClick,
} from "../global.js";
import {
  Action,
  BuyShopItem,
  ChangeCursorState,
  ChangeScene,
  NextLevel,
  PlayerAtack,
} from "../action.js";
import { CURSORNONE } from "../cursor.js";
import { sprites } from "../sprite.js";
import { Armor } from "../items/armor.js";
import { Shield } from "../items/shield.js";
import { Weapon } from "../items/weapon.js";
import { Consumable } from "../items/consumable.js";
import timeTracker from "../timer/timeTracker.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import { utils } from "../utils.js";
import type SceneManager from "./sceneManager.js";
import CaveManager from "./caveManager.js";
import BattleManager from "./battleManager.js";
import ShopManager from "./shopManager.js";
import { Battle } from "./battle.js";

const transitionObject = new GameObject({
  sprite: sprites.scene_transition,
  height: 128,
  width: 128,
  pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
});

transitionObject.render = (canvasManager: CanvasManager) => {
  if (transitionObject.hidden) {
    return;
  }
  canvasManager.renderAnimationFrame(
    transitionObject.sprite,
    transitionObject.pos,
    transitionObject.width,
    transitionObject.height,
    4,
    4,
    transitionObject.birthTic,
    timeTracker.currentGameTic,
    1,
    new Position(),
    false
  );
};

transitionObject.hidden = true;

export class LevelManager extends GameObject {
  gameState: GameState;
  shopManager: ShopManager;
  caveManager: CaveManager;
  battleManager: BattleManager;
  currentSceneManager: SceneManager;

  constructor(gameState: GameState) {
    super({
      pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      sprite: sprites.transparent_pixel,
      width: 128,
      height: 128,
    });
    this.gameState = gameState;
    this.hoverFunction = (cursorPos: Position) => {
      return this.handleHover(cursorPos);
    };
    this.clickFunction = (
      cursorPos: Position,
      button: typeof CLICKRIGHT | typeof CLICKLEFT
    ) => {
      return this.handleClick(cursorPos, button);
    };
    this.heldFunction = (
      cursorPos: Position,
      button: typeof CLICKRIGHT | typeof CLICKLEFT
    ) => {
      return this.handleHeld(cursorPos, button);
    };
    this.shopManager = new ShopManager(gameState, this.pos);
    this.caveManager = new CaveManager(gameState, this.pos);
    this.battleManager = new BattleManager(gameState, this.pos);
    switch (gameState.currentScene) {
      case "battle":
        this.currentSceneManager = this.battleManager;
        break;
      case "cave":
        this.currentSceneManager = this.caveManager;
        break;
      case "shop":
        this.currentSceneManager = this.shopManager;
        break;
    }
  }

  render(canvasManager: CanvasManager): void {
    this.currentSceneManager.render(canvasManager);
    transitionObject.render(canvasManager);
  }

  screenTransition(
    transitionFunc: (() => Action | void | null) | undefined,
    delay: number = 0
  ) {
    this.gameState.inTransition = true;
    const delayTimer = new Timer(delay, () => {
      transitionObject.hidden = false;
      transitionObject.resetAnimation();
      const transitionFuncTimer = new Timer(
        8 / timeTracker.ticsPerSecond,
        transitionFunc
      );
      const transitionEndTimer = new Timer(
        16 / timeTracker.ticsPerSecond,
        () => {
          this.gameState.inTransition = false;
        }
      );
      timerQueue.push(transitionFuncTimer, transitionEndTimer);
      transitionFuncTimer.start();
      transitionEndTimer.start();
    });
    timerQueue.push(delayTimer);
    delayTimer.start();
  }

  changeScene(action: ChangeScene) {
    this.gameState.gameTimer.pause();
    const currentScene = this.gameState.currentScene;
    this.screenTransition(
      () => {
        switch (action.newScene) {
          case "battle":
            this.gameState.level.cave.clearExposedWorms();
            this.gameState.level.cave.updateAllStats();
            this.gameState.battle = new Battle();
            this.currentSceneManager = this.battleManager;
            break;
          case "cave":
            switch (currentScene) {
              case "battle":
                this.gameState.level.cave.wormsLeft--;
                this.caveManager.checkCaveClear();
              case "shop":
                this.currentSceneManager = this.caveManager;
                break;
            }
            break;
          case "shop":
            this.currentSceneManager = new ShopManager(
              this.gameState,
              this.pos
            );
            break;
        }
      },
      currentScene + action.newScene == "battlecave" ||
        action.newScene == "battle"
        ? 0.5
        : 0
    );
  }

  handleAction(action: Action | void) {
    if (!action) {
      return;
    }
    if (action instanceof ChangeScene) {
      this.changeScene(action);
    } else if (action instanceof NextLevel) {
      this.screenTransition(() => {
        this.gameState.level = this.gameState.level.nextLevel();
        this.gameState.gameTimer.addSecs(60);
        this.gameState.level.cave.start(
          action.starterGridPos,
          this.gameState.passiveItemNames
        );
      });
    } else {
      console.log("unhandled action", action);
    }
  }

  handleHover(cursorPos: Position) {
    let action = this.currentSceneManager.handleHover(cursorPos);
    if (this.gameState.inTransition) {
      action = new ChangeCursorState(CURSORNONE);
    }
    return action;
  }

  handleClick(
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) {
    if (this.gameState.inTransition) {
      return;
    }
    this.handleAction(this.currentSceneManager.handleClick(cursorPos, button));
  }

  handleHeld(cursorPos: Position, button: cursorClick) {
    if (this.gameState.inTransition) {
      return;
    }
    this.handleAction(this.currentSceneManager.handleHeld(cursorPos, button));
  }
}
