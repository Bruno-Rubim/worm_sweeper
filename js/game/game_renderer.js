import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameCursor, gameManager } from "./game_manager.js"
import { Tool } from "./item.js"

function renderBorder(){
    ctx.drawImage(
        findSprite('game_border').img,
        0,0,
        borderLength * renderScale,
        borderLength * renderScale
    )
}

function renderTools(){
    let index = 0
    gameManager.inventory.forEach(item => {
        if (!(item instanceof Tool)){
            return
        }
        ctx.drawImage(
            item.sprite,
            ((index * 16) + 2) * renderScale,
            (borderLength - borderThicness + 2) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
        index++
    });
    ctx.drawImage(
        gameManager.player.shield.sprite,
        (2) * renderScale,
        (borderLength - borderThicness - 16) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
    ctx.drawImage(
        gameManager.player.weapon.sprite,
        (2) * renderScale,
        (borderLength - borderThicness - 34) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
}

const numberWidth = 8
const numberPadding = 6

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

function renderTimer(){
    ctx.drawImage(
        findSprite(`icon_clock`).img,
        numberPadding * renderScale,
        numberPadding * renderScale,
        numberWidth * renderScale,
        numberWidth * renderScale
    )
    let miliseconds = gameManager.timer.miliseconds
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
        findSprite(`icon_worm`).img,
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
            (borderLength - ((numberWidth-1) * (vector.length + 3)) - 2) * renderScale,
            6 * renderScale,
            numberWidth * renderScale,
            numberWidth * renderScale
        )
    }
}

function renderGoldCounter(){
    ctx.drawImage(
        findSprite(`icon_gold`).img,
        (borderLength - numberPadding - 8) * renderScale,
        (borderLength - numberPadding - 8) * renderScale,
        8 * renderScale,
        8 * renderScale
    )
    let goldCount = gameManager.gold
    let string = goldCount.toString()
    let vector = [...string]
    renderNumbers(vector, numberPadding + 10, borderLength - numberWidth - numberPadding, -1, 'reversed', 'gold')
}

function renderHealth(){
    for (let i = 0; i < gameManager.player.hp;i++){
        ctx.drawImage(
            findSprite('icon_heart').img,
            (((borderLength/2) - ((gameManager.player.hp) * 4.5)) + (9 * i)) * renderScale,
            (6) * renderScale,
            8 * renderScale,
            8 * renderScale
        )
    }
}

function renderDefeat(){
    ctx.drawImage(
        findSprite('defeat').img,
        borderThicness * renderScale,
        borderThicness * renderScale,
        128 * renderScale,
        128 * renderScale
    )
}

function renderUI(){
    renderTools()
    renderTimer()
    renderWormCounter()
    renderGoldCounter()
    renderHealth()
    if (gameManager.ended){
        renderDefeat()
    }
}

function renderCursor(){
    ctx.drawImage(
        gameCursor.sprite,
        (gameCursor.posX - 8) * renderScale,
        (gameCursor.posY - 8) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
}

export function renderGame(){
    renderBorder()
    gameManager.currentLevel.render()
    renderUI()
    renderCursor()
}