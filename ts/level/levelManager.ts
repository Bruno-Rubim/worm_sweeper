import CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";
import type GameState from "../gameState.js";
import {
  BORDERTHICKLEFT,
  BORDERTHICKTOP,
  CLICKLEFT,
  CLICKRIGHT,
  RIGHT,
  type cursorClick,
} from "../global.js";
import {
  Action,
  ChangeCursorState,
  ChangeScene,
  NextLevel,
  ResetShop,
  RestartGame,
  StartBattle,
} from "../action.js";
import { CURSORBOOK, CURSORDEFAULT, CURSORNONE } from "../cursor.js";
import { sprites } from "../sprites.js";

import timeTracker from "../timer/timeTracker.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";

import type SceneManager from "./sceneManager.js";
import CaveManager from "./caveManager.js";
import BattleManager from "./battleManager.js";
import ShopManager from "./shopManager.js";
import { Battle } from "./battle.js";
import type { SoundManager } from "../soundManager.js";
import sounds from "../sounds.js";
import { bookPages } from "../bookPages.js";

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
    transitionObject.firstAnimationTic,
    timeTracker.currentGameTic,
    1,
    new Position(),
    false
  );
};

transitionObject.hidden = true;

// Manages rendering and interactions with the current level from gameState
export class LevelManager extends GameObject {
  gameState: GameState;
  soundManager: SoundManager;

  currentSceneManager: SceneManager;
  // Holds the current current sceneManager which can be any of the 3 below
  // (check strategy design pattern for a general idea of what this is)
  shopManager: ShopManager;
  caveManager: CaveManager;
  battleManager: BattleManager;

  constructor(gameState: GameState, soundManager: SoundManager) {
    super({
      pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      sprite: sprites.transparent_pixel,
      width: 128,
      height: 128,
    });
    this.gameState = gameState;
    this.soundManager = soundManager;
    this.shopManager = new ShopManager(gameState, this.pos, this.soundManager);
    this.caveManager = new CaveManager(gameState, this.pos, this.soundManager);
    this.battleManager = new BattleManager(
      gameState,
      this.pos,
      this.soundManager
    );
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
    transitionObject.endAnimation();
  }

  /**
   * Renders the current screen or level depending on the gameState
   * @param canvasManager
   * @returns
   */
  render(canvasManager: CanvasManager): void {
    if (this.gameState.inBook) {
      canvasManager.renderSprite(
        sprites.bg_rules,
        this.pos,
        this.width,
        this.height
      );
      const fontSize = 0.6;
      const padding = 10 * fontSize;
      canvasManager.renderText(
        "book",
        this.pos.add(padding, padding),
        bookPages[this.gameState.bookPage]!,
        RIGHT,
        this.width - padding * 2,
        fontSize
      );
      return;
    }
    if (this.gameState.paused) {
      canvasManager.renderSprite(
        sprites.screen_paused,
        this.pos,
        this.width,
        this.height
      );
      return;
    }

    this.currentSceneManager.render(canvasManager);
    transitionObject.render(canvasManager);
    if (this.gameState.gameOver) {
      canvasManager.renderSprite(
        sprites.screen_defeat,
        this.pos,
        this.width,
        this.height
      );
    }
  }

  /**
   * Checks if the current battle is over
   */
  checkBattleEnd() {
    this.handleAction(this.battleManager.checkBattleEnd());
  }

  /**
   * Plays the screen transition animation and runs a given function halfway through, can have a delay before the transition
   * @param transitionFunc will run when the screen is completely black
   * @param delay seconds to delay the transition
   */
  screenTransition(
    transitionFunc: (() => Action | void | null) | undefined,
    delay: number = 0
  ) {
    this.gameState.inTransition = true;
    const delayTimer = new Timer({
      goalSecs: delay,
      goalFunc: () => {
        transitionObject.hidden = false;
        transitionObject.resetAnimation();
        const transitionFuncTimer = new Timer({
          goalSecs: 8 / timeTracker.ticsPerSecond,
          goalFunc: transitionFunc,
        });
        const transitionEndTimer = new Timer({
          goalSecs: 16 / timeTracker.ticsPerSecond,
          goalFunc: () => {
            this.gameState.inTransition = false;
          },
        });
        timerQueue.push(transitionFuncTimer, transitionEndTimer);
        transitionFuncTimer.start();
        transitionEndTimer.start();
      },
    });
    timerQueue.push(delayTimer);
    delayTimer.start();
  }

  /**
   * Transitions and changes the current scene of gameState and the currentSceneManager as its function
   * @param scene
   */
  changeScene(scene: "battle" | "cave" | "shop") {
    const currentScene = this.gameState.currentScene;
    if (scene == "cave" && currentScene == "shop") {
      this.soundManager.playSound(sounds.steps);
    }
    this.screenTransition(
      () => {
        switch (scene) {
          case "battle":
            this.gameState.level.cave.clearExposedWorms();
            this.gameState.level.cave.updateAllStats();
            this.currentSceneManager = this.battleManager;
            this.gameState.battle?.start(
              this.gameState.inventory.armor.defense +
                (this.gameState.hasItem("safety_helmet") ? 1 : 0),
              this.gameState.inventory.armor.reflection,
              this.gameState.inventory.armor.spikes
            );
            break;
          case "cave":
            switch (currentScene) {
              case "battle":
                this.gameState.level.cave.wormsLeft--;
                this.gameState.level.cave.wormQuantity--;
                this.caveManager.checkCaveClear();
              // Falls through the next lines
              case "shop":
                this.currentSceneManager = this.caveManager;
                this.gameState.unpauseGameTimer();
                break;
            }
            break;
          case "shop":
            // Pauses timer when entering a shop
            this.gameState.pauseGameTimer();
            this.currentSceneManager = this.shopManager;
            break;
        }
        this.gameState.currentScene = scene;
      },
      // Sets the transition delay to 0.5 if going into battle, 0 otherwise
      scene == "battle" ? 0.5 : 0
    );
  }

  /**
   * Handles different actions
   * @param action
   * @returns
   */
  handleAction(action: Action | void) {
    if (!action) {
      return;
    }
    if (action instanceof ChangeScene) {
      this.changeScene(action.newScene);
    } else if (action instanceof NextLevel) {
      this.screenTransition(() => {
        this.gameState.level = this.gameState.level.nextLevel();
        this.gameState.gameTimer.addSecs(60);
        this.gameState.level.cave.start(
          action.starterGridPos,
          this.gameState.itemNames
        );
      });
    } else if (action instanceof StartBattle) {
      this.gameState.battle = new Battle(
        this.gameState.level.depth,
        action.enemyCount
      );
      this.changeScene("battle");
    } else if (action instanceof ResetShop) {
      // Reset shop items
      if (this.gameState.gold >= this.gameState.shopResetPrice) {
        this.gameState.level.shop.setItems();
        this.soundManager.playSound(sounds.purchase);
        this.gameState.gold -= this.gameState.shopResetPrice;
        this.gameState.shopResetPrice += 5;
      } else {
        this.soundManager.playSound(sounds.wrong);
      }
    } else {
      console.warn("unhandled action", action);
    }
  }

  /**
   * Overwrites the sceneManager's hover action if it meets certain conditions to change cursor
   * @param cursorPos
   * @returns
   */
  hoverFunction = (cursorPos: Position) => {
    if (this.gameState.inBook) {
      return new ChangeCursorState(CURSORBOOK);
    }
    if (this.gameState.gameOver || this.gameState.paused) {
      return new ChangeCursorState(CURSORDEFAULT);
    }
    if (this.gameState.inTransition) {
      return new ChangeCursorState(CURSORNONE);
    }
    return this.currentSceneManager.handleHover(cursorPos);
  };

  /**
   * Overwrites the sceneManager's hover action if it meets certain conditions to change cursor
   * @param cursorPos
   * @returns
   */
  notHoverFunction = () => {
    let action = this.currentSceneManager.handleNotHover();
    return action;
  };

  /**
   * handles the currentSceneManager's click Action
   * @param cursorPos
   * @param button
   * @returns
   */
  clickFunction = (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => {
    if (this.gameState.inBook) {
      if (button == CLICKLEFT) {
        this.gameState.bookPage = Math.min(
          bookPages.length - 1,
          this.gameState.bookPage + 1
        );
      } else {
        this.gameState.bookPage = Math.max(0, this.gameState.bookPage - 1);
      }
      return;
    }
    if (this.gameState.paused) {
      return;
    }
    if (this.gameState.gameOver) {
      if (this.gameState.heldWhileDeath) {
        this.gameState.heldWhileDeath = false;
        return;
      }
      return new RestartGame();
    }
    if (this.gameState.inTransition) {
      return;
    }
    if (this.gameState.inBook) {
      return;
    }
    this.handleAction(this.currentSceneManager.handleClick(cursorPos, button));
  };

  /**
   * handles the currentSceneManager's held Action
   * @param cursorPos
   * @param button
   * @returns
   */
  heldFunction = (cursorPos: Position, button: cursorClick) => {
    if (
      this.gameState.inTransition ||
      this.gameState.inBook ||
      this.gameState.gameOver ||
      this.gameState.paused
    ) {
      return;
    }
    this.handleAction(this.currentSceneManager.handleHeld(cursorPos, button));
  };
}
