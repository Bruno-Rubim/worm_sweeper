import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameCursor, gameManager } from "./game_manager.js"

function renderBorder(){
    ctx.drawImage(
        findSprite('game_border').img,
        0,0,
        borderLength * renderScale,
        borderLength * renderScale
    )
}

function renderTools(){
    gameManager.inventory.forEach((tool, index) => {
        ctx.drawImage(
            findSprite(tool).img,
            ((index * 16) + 2) * renderScale,
            (borderLength - borderThicness + 2) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
    });
}

const numberWidth = 8

export function renderNumbers(vector, posStartX, posStartY, numberGap, order, color){
    if (order == 'normal'){
        vector.forEach((number, index)=>{
            ctx.drawImage(
                findSprite(`numbers_${color}`).img,
                numberWidth * number,
                0,
                numberWidth,
                numberWidth,
                ((numberWidth * index) + posStartX + (numberGap * index)) * renderScale,
                posStartY * renderScale,
                numberWidth * renderScale,
                numberWidth * renderScale
            )
        })
    } else {
        vector.forEach((number, index)=>{
            ctx.drawImage(
                findSprite(`numbers_${color}`).img,
                numberWidth * number,
                0,
                numberWidth,
                numberWidth,
                (
                    borderLength -
                    (posStartX + //base start
                        (((numberWidth + numberGap) * (vector.length - index))) //individual number
                    )
                )* renderScale,
                posStartY * renderScale,
                numberWidth * renderScale,
                numberWidth * renderScale
            )
        })
    }
}

const numberPadding = 6

function renderTimer(){
    ctx.drawImage(
        findSprite(`clock_icon`).img,
        numberPadding * renderScale,
        numberPadding * renderScale,
        numberWidth * renderScale,
        numberWidth * renderScale
    )
    let miliseconds = gameManager.currentLevel.timer.miliseconds
    if (miliseconds <= 0){
        miliseconds = 0
    }
    let string = miliseconds.toString()
    let vector = [...string]
    vector.pop()
    vector.pop()
    vector.pop()
    renderNumbers(vector, 14, numberPadding, -1, 'normal', 'blue')

}

function renderWormCounter(){
    ctx.drawImage(
        findSprite(`worm_icon`).img,
        (borderLength - numberPadding - 8) * renderScale,
        numberPadding * renderScale,
        8 * renderScale,
        8 * renderScale
    )
    let counter = gameManager.currentLevel.wormsLeft
    let negative = false;
    if (counter < 0){
        counter = Math.abs(counter)
        negative = true;
    }
    let string = counter.toString()
    let vector = [...string]
    renderNumbers(vector, numberPadding + 10, numberPadding, -1, 'reversed', 'red')
    if (negative){
        ctx.drawImage(
            findSprite(`minus_red`).img,
            (borderLength - (numberWidth * (vector.length + 1)))* renderScale,
            2 * renderScale,
            numberWidth * renderScale,
            numberWidth * renderScale
        )
    }
}

function renderGoldCounter(){
    let goldCount = gameManager.gold
    let string = goldCount.toString()
    let vector = [...string]
    renderNumbers(vector, numberPadding, borderLength - numberWidth - numberPadding, -1, 'reversed', 'gold')
}

function renderUI(){
    renderTools()
    renderTimer()
    renderWormCounter()
    renderGoldCounter()
}

function renderCursor(){
    ctx.drawImage(
        gameCursor.sprite,
        gameCursor.posX * renderScale,
        gameCursor.posY * renderScale,
        8 * renderScale,
        8 * renderScale
    )
}

export function renderGame(){
    renderBorder()
    renderUI()
    gameManager.currentLevel.render()
    renderCursor()
}