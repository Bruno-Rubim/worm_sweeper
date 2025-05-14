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
        findSprite(gameManager.player.shield.name).img,
        (2) * renderScale,
        (borderLength - borderThicness - 16) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
    ctx.drawImage(
        findSprite(gameManager.player.weapon.name).img,
        (2) * renderScale,
        (borderLength - borderThicness - 34) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
}

const numberWidth = 8
const numberPadding = 6

export function renderNumbers(number, digitSkip, posStartX, posStartY, numberGap, order, color){
    let vector = [...number.toString()]
    if (digitSkip > vector.length){
        digitSkip = vector.length
    }
    for (let i = 0; i < digitSkip; i++){
        vector.pop()
    }
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
    } else if (order == 'reversed') {
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
    } else if (order == 'centered') {
        vector.forEach((number, index)=>{
            ctx.drawImage(
                findSprite(`numbers_${color}`).img,
                numberWidth * number,
                0,
                numberWidth,
                numberWidth,
                (
                    ((posStartX) - ((vector.length) * ((numberWidth + numberGap)/2))) + ((numberWidth + numberGap) * index)
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
    let seconds = gameManager.timer.seconds
    if (seconds <= 0){
        seconds = 0
    }
    renderNumbers(seconds, 0, 14, numberPadding, -1, 'normal', 'blue')
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
    renderNumbers(counter, 0, numberPadding + 10, numberPadding, -1, 'reversed', 'red')
    if (negative){
        ctx.drawImage(
            findSprite(`minus_red`).img,
            (borderLength - ((numberWidth-1) * (Math.floor(counter/10) + 4)) - 2) * renderScale,
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
    renderNumbers(gameManager.gold, 0, numberPadding + 10, borderLength - numberWidth - numberPadding, -1, 'reversed', 'gold')
}

function renderHealth(){
    let shiftY = 6
    if (gameManager.currentLevel.currentBattle){
        shiftY = 135
    }
    for (let i = 0; i < gameManager.player.hp;i++){
        ctx.drawImage(
            findSprite('icon_heart').img,
            (((borderLength/2) - ((gameManager.player.hp) * 4.5)) + (9 * i)) * renderScale,
            (shiftY) * renderScale,
            8 * renderScale,
            8 * renderScale
        )
    }
}

function renderDepth(){
    renderNumbers(gameManager.currentLevel.depth +1, 0, borderLength - numberPadding - numberWidth, numberPadding + 10, -1, 'normal', 'green')
}

function renderScreenOverlay(){
    let img = null;
    if (gameManager.ended){
        img = findSprite('screen_defeat').img
    } else if (gameManager.paused){
        img = findSprite('screen_paused').img
    }
    if (img == null){
        return
    }
    ctx.drawImage(
        img,
        borderThicness * renderScale,
        borderThicness * renderScale,
        128 * renderScale,
        128 * renderScale
    )
}

function renderUI(){
    renderTools()
    renderGoldCounter()
    renderDepth()
    renderHealth()
    renderTimer()
    renderWormCounter()
    renderScreenOverlay()
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
    gameManager.currentLevel.render()
    renderBorder()
    renderUI()
    renderCursor()
}