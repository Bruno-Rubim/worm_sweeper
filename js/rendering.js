import { renderGame } from "/js/game/game_manager.js";
import { canvasElement, clearCanvas } from "/js/canvas_handler.js";
import { ctx } from "/js/canvas_handler.js";
import { timedCondition } from "/js/time_manager.js";

export function render(){
    timedCondition(()=>{})
    clearCanvas();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    renderGame()
}
