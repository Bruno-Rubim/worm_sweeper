import { render } from "/js/rendering.js";
import { updateCanvas } from "/js/canvas_handler.js";


export function frame(){
    updateCanvas()
    render()
    requestAnimationFrame(frame);
}