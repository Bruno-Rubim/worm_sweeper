import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameCursor, gameManager } from "./game_manager.js"

function renderBorder(){
    ctx.drawImage(
        findSprite('game_border').img,
        0,0,
        160 * renderScale,
        160 * renderScale
    )
}

function renderTools(){
    ctx.drawImage(
        findSprite(gameManager.selectedTool).img,
        0 * renderScale,
        (borderLength - borderThicness) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
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
        for(let i = vector.length - 1; i >= 0; i--){
            const number = vector[i]
            ctx.drawImage(
                findSprite(`numbers_red`).img,
                numberWidth * number,
                0,
                numberWidth,
                numberWidth,
                (borderLength - (numberWidth * (vector.length - i) + posStartX))* renderScale,
                posStartY * renderScale,
                numberWidth * renderScale,
                numberWidth * renderScale
            )
        }
    }
}

function renderTimer(){
    ctx.drawImage(
        findSprite(`clock_icon`).img,
        4 * renderScale,
        4 * renderScale,
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
    renderNumbers(vector, 14, 4, -1, 'normal', 'blue')

}

function renderFlagCounter(){
    let counter = gameManager.currentLevel.flagsLeft
    let negative = false;
    if (counter < 0){
        counter = Math.abs(counter)
        negative = true;
    }
    let string = counter.toString()
    let vector = [...string]
    renderNumbers(vector, 4, 4, -1, 'reversed', 'red')
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
    for(let i = vector.length - 1; i >= 0; i--){
        const number = vector[i]
        ctx.drawImage(
            findSprite(`numbers_gold`).img,
            numberWidth * number,
            0,
            numberWidth,
            numberWidth,
            (borderLength - (numberWidth * (vector.length - i) + 1))* renderScale,
            (borderLength - (numberWidth + 2)) * renderScale,
            numberWidth * renderScale,
            numberWidth * renderScale
        )
    }
}

function renderUI(){
    renderTools()
    renderTimer()
    renderFlagCounter()
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