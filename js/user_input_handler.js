import { canvasElement, renderScale } from "./canvas_handler.js";
import { clickHandler, KEYDOWN, keyHandler, KEYUP, mouseMoveHandler, unfocusHandler} from "./game/game_input_handler.js";


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

window.addEventListener("blur", (event)=>{
    unfocusHandler()
});

canvasElement.addEventListener("mousemove", (event)=>{
    let canvasX = Number(canvasElement.style.left.replace("px",''))
    let canvasY = Number(canvasElement.style.top.replace("px",''))
    let gameX = Math.floor((event.clientX - canvasX)/renderScale)
    let gameY = Math.floor((event.clientY - canvasY)/renderScale)
    mouseMoveHandler(gameX, gameY)
})