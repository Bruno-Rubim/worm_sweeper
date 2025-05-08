import { canvasElement, clearCanvas } from "./canvas_handler.js";
import { ctx } from "./canvas_handler.js";
import { renderGame } from "./game/game_renderer.js";
import { timedCondition } from "./time_manager.js";

export function render(){
    timedCondition(()=>{})
    clearCanvas();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    renderGame()
}
