import CanvasManager from "./canvasManager.js";
import GameObject from "./gameObject.js";
import GameState, {} from "./gameState.js";
import { GAMEHEIGHT, GAMEWIDTH } from "./global.js";
import Position from "./position.js";
import { sprites } from "./sprite.js";
import { utils } from "./utils.js";
function renderStats(canvasManager, gameState) {
    canvasManager.renderText("numbers_blue", new Position(6, 6), "$tim " + Math.floor(gameState.gameTimer.secondsRemaining).toString());
    canvasManager.renderText("numbers_red", new Position(54, 6), "$wrm " + gameState.level.cave.wormsLeft.toString());
    canvasManager.renderText("numbers_brown", new Position(GAMEWIDTH - 78, 6), "$blk " + gameState.level.cave.blocksLeft.toString());
    canvasManager.renderText("numbers_gold", new Position(GAMEWIDTH - 29, 6), "$gld " + gameState.gold.toString());
    for (let i = 0; i < gameState.health; i++) {
        canvasManager.renderText("icons", new Position(88 + i * 9 - (9 * gameState.health) / 2, GAMEHEIGHT - 14), "$hrt");
    }
}
function renderItems(canvasManager, gameState) {
    for (const key of Object.keys(gameState.inventory)) {
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
export function renderBorder(canvasManager, gameState) {
    gameBorder.render(canvasManager);
    renderItems(canvasManager, gameState);
    renderStats(canvasManager, gameState);
}
