import CanvasManager from "./canvasManager.js";
import GameObject from "./gameObject.js";
import GameState, { type inventory } from "./gameState.js";
import { GAMEHEIGHT, GAMEWIDTH } from "./global.js";
import Position from "./position.js";
import { sprites } from "./sprite.js";
import timeTracker from "./timeTracker.js";

const iconSheet = sprites.icon_sheet;
const iconSheetPos = {
  worm: new Position(0, 0),
  gold: new Position(1, 0),
  door: new Position(2, 0),
  block: new Position(3, 0),
  clock: new Position(4, 0),
  heart: new Position(5, 0),
};

const numberSheet = sprites.number_sheet;

function renderStats(canvasManager: CanvasManager, gameState: GameState) {
  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(6, 6),
    8,
    8,
    iconSheetPos.clock
  );
  canvasManager.renderText(
    "numbers_blue",
    new Position(14, 6),
    gameState.time.toString()
  );

  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(54, 6),
    8,
    8,
    iconSheetPos.worm
  );
  canvasManager.renderText(
    "numbers_red",
    new Position(64, 6),
    gameState.level.cave.wormsLeft.toString()
  );

  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(GAMEWIDTH - 78, 6),
    8,
    8,
    iconSheetPos.block
  );
  canvasManager.renderText(
    "numbers_brown",
    new Position(GAMEWIDTH - 69, 6),
    gameState.level.cave.blockCount.toString()
  );

  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(GAMEWIDTH - 29, 6),
    8,
    8,
    iconSheetPos.gold
  );
  canvasManager.renderText(
    "numbers_gold",
    new Position(GAMEWIDTH - 19, 6),
    gameState.gold.toString()
  );
}

function renderItems(canvasManager: CanvasManager, gameState: GameState) {
  for (const key of Object.keys(gameState.inventory) as (keyof inventory)[]) {
    const item = gameState.inventory[key];
    if (!item) {
      continue;
    }
    item.render(canvasManager);
  }
}

const gameBorder = new GameObject({
  sprite: sprites.game_border,
  height: GAMEHEIGHT,
  width: GAMEWIDTH,
});

export function renderBorder(
  canvasManager: CanvasManager,
  gameState: GameState
) {
  gameBorder.render(canvasManager);
  renderItems(canvasManager, gameState);
  renderStats(canvasManager, gameState);
}
