import { render } from "./rendering.js";
import { updateCanvas } from "./canvas_handler.js";


export function frame(){
    updateCanvas()
    render()
    requestAnimationFrame(frame);
}