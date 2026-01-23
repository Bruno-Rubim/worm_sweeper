import { canvasManager } from "./canvasManager.js";
import GameObject from "./gameElements/gameObject.js";
import { gameState } from "./gameState.js";
import { GAMEHEIGHT, GAMEWIDTH, LEFT, CENTER } from "./global.js";
import Position from "./gameElements/position.js";
import { sprites } from "./sprites.js";
import playerInventory, { type inventory } from "./playerInventory.js";
import {
  bagItem,
  bookItem,
  flagItem,
  musicButton,
  picaxeItem,
  sfxButton,
} from "./items/uiItems.js";

/**
 * Renders the current game stats
 * @param canvasManager
 * @param gameState
 */
function renderStats() {
  // Time left
  canvasManager.renderText(
    "numbers_blue",
    new Position(6, 6),
    "$tim " + Math.floor(gameState.gameTimer.secondsRemaining).toString(),
  );

  // Worms number
  canvasManager.renderText(
    "numbers_red",
    new Position(62, 6),
    "$wrm " + gameState.level.cave.wormsLeft.toString(),
    CENTER,
  );

  // Blocks left
  canvasManager.renderText(
    "numbers_brown",
    new Position(GAMEWIDTH - 66, 6),
    "$blk " + gameState.level.cave.blocksLeft.toString(),
    CENTER,
  );

  // Gold number
  canvasManager.renderText(
    "numbers_gold",
    new Position(GAMEWIDTH - 4, 6),
    "$gld " + gameState.gold.toString(),
    LEFT,
  );

  // Level number
  canvasManager.renderText(
    "numbers_green",
    new Position(6, GAMEHEIGHT - 14),
    "$dor " + (gameState.level.depth + 1).toString(),
  );

  // Death count
  canvasManager.renderText(
    "numbers_red",
    new Position(GAMEWIDTH - 4, GAMEHEIGHT - 14),
    "$skl" + gameState.deathCount.toString(),
    LEFT,
  );

  // Player health
  if (gameState.health > 0) {
    const roundedHealth = Math.floor(gameState.health);
    canvasManager.renderText(
      "icons",
      new Position(GAMEWIDTH / 2, GAMEHEIGHT - 14),
      "$hrt".repeat(roundedHealth) +
        (gameState.health > roundedHealth ? "$hhr" : ""),
      CENTER,
    );
  }
}

/**
 * Renders the current items from the inventory
 * @param canvasManager
 * @param gameState
 */
function renderItems() {
  playerInventory.weapon.render();
  playerInventory.shield.render();
  playerInventory.armor.render();
  playerInventory.active.render();
  bookItem.render();
  bagItem.render();
  musicButton.render();
  sfxButton.render();
}

// Object for the border of the game
const gameBorder = new GameObject({
  sprite: sprites.game_border,
  height: GAMEHEIGHT,
  width: GAMEWIDTH,
});

/**
 * Renders the game border UI stats and inventory objects
 * @param canvasManager
 * @param gameState
 */
export function renderBorder() {
  gameBorder.render();
  renderItems();
  renderStats();
}
