import type CanvasManager from "./canvasManager.js";
import GameObject from "./gameObject.js";
import type GameState from "./gameState.js";
import Position from "./position.js";
import { findSprite } from "./sprites/findSprite.js";

const iconSheet = findSprite("icon_sheet");
const iconSheetPos = {
  worm: new Position(0, 0),
  gold: new Position(1, 0),
  door: new Position(2, 0),
  block: new Position(3, 0),
  clock: new Position(4, 0),
  heart: new Position(5, 0),
};

const numberSheet = findSprite("number_sheet");

const gameBorder = new GameObject({
  spriteName: "game_border",
  height: 168,
  width: 200,
});

export function renderBorder(
  canvasManager: CanvasManager,
  gameState: GameState
) {
  gameBorder.render(canvasManager);
  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(6, 6),
    8,
    8,
    iconSheetPos.clock
  );
  canvasManager.renderText(
    numberSheet,
    "numbers_blue",
    new Position(14, 6),
    gameState.time.toString()
  );

  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(48, 6),
    8,
    8,
    iconSheetPos.door
  );
  canvasManager.renderText(
    numberSheet,
    "numbers_green",
    new Position(56, 6),
    (gameState.level.depth + 1).toString()
  );

  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(87, 6),
    8,
    8,
    iconSheetPos.worm
  );
  canvasManager.renderText(
    numberSheet,
    "numbers_red",
    new Position(96, 6),
    gameState.level.wormsLeft.toString()
  );

  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(126, 6),
    8,
    8,
    iconSheetPos.block
  );
  canvasManager.renderText(
    numberSheet,
    "numbers_brown",
    new Position(134, 6),
    gameState.level.blockCount.toString()
  );

  canvasManager.renderSpriteFromSheet(
    iconSheet,
    new Position(170, 6),
    8,
    8,
    iconSheetPos.gold
  );
  canvasManager.renderText(
    numberSheet,
    "numbers_gold",
    new Position(179, 6),
    gameState.gold.toString()
  );
}
