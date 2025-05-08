import { canvasElement, renderScale } from "./canvas_handler.js";
import { clickHandler, KEYDOWN, keyHandler, KEYUP, wheelHandler } from "./game/game_input_handler.js";


document.addEventListener("keyup", (event)=>{
    keyHandler(event.key, KEYUP)
})

document.addEventListener("keydown", (event)=>{
    keyHandler(event.key, KEYDOWN)
})

document.addEventListener("mouseup", (event)=>{
    let canvasX = Number(canvasElement.style.left.replace("px",''))
    let canvasY = Number(canvasElement.style.top.replace("px",''))
    let gameX = Math.floor((event.clientX - canvasX)/renderScale)
    let gameY = Math.floor((event.clientY - canvasY)/renderScale)
    clickHandler(gameX, gameY)
});

document.addEventListener("wheel", (event)=>{
    wheelHandler(event.deltaY)
});