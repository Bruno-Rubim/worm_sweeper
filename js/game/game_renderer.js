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

function renderInventory(){
    let index = 0
    gameManager.inventory.forEach(item => {
        if (!(item instanceof Tool)){
            return
        }
        ctx.drawImage(
            item.sprite,
            (borderLength - borderThicness + 2) * renderScale,
            (borderLength - ((index + 2) * 17) - 2) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
        index++
    });
    ctx.drawImage(
        findSprite(gameManager.player.shield.name).img,
        (2) * renderScale,
        (borderLength - borderThicness - 34) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
    ctx.drawImage(
        findSprite(gameManager.player.weapon.name).img,
        (2) * renderScale,
        (borderLength - borderThicness - 17) * renderScale,
        16 * renderScale,
        16 * renderScale
    )
    if (gameManager.player.armor){
        ctx.drawImage(
            findSprite(gameManager.player.armor.name).img,
            (2) * renderScale,
            (borderLength - borderThicness - 53) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
    }
}

const numberWidth = 8
const numberPadding = 6
const numberSymbols = {
    '.': 0,
    '-': 1,
}
const symbolGap = {
    '.': 1.5,
    '-': 0,
}

export function renderNumbers(number, digitSkip, posStartX, posStartY, numberGap, order, color){
    let vector = [...number.toString()]
    if (digitSkip > vector.length){
        digitSkip = vector.length
    }
    for (let i = 0; i < digitSkip; i++){
        vector.pop()
    }
    if (order == 'normal'){
        let shiftX = 0
        vector.forEach((char, index)=>{
            if (isNaN(Number(char))){
                ctx.drawImage(
                    findSprite(`numbers_symbols_${color}`).img,
                    numberWidth * numberSymbols[char],
                    0,
                    numberWidth,
                    numberWidth,
                    ((numberWidth * index) + posStartX + ((numberGap - Math.floor(symbolGap[char])) * index)) * renderScale,
                    posStartY * renderScale,
                    numberWidth * renderScale,
                    numberWidth * renderScale
                )
                shiftX -= symbolGap[char]*2
                return
            }
            let number = Number(char)
            ctx.drawImage(
                findSprite(`numbers_${color}`).img,
                numberWidth * number,
                0,
                numberWidth,
                numberWidth,
                ((numberWidth * index) + posStartX + (numberGap * index) + shiftX) * renderScale,
                posStartY * renderScale,
                numberWidth * renderScale,
                numberWidth * renderScale
            )
        })
    } else if (order == 'reversed') {
        vector.forEach((char, index)=>{
            if (isNaN(Number(char))){
                ctx.drawImage(
                    findSprite(`numbers_symbols_${color}`).img,
                    numberWidth * numberSymbols[char],
                    0,
                    numberWidth,
                    numberWidth,
                    ((numberWidth * index) + posStartX + ((numberGap - Math.floor(symbolGap[char])) * index)) * renderScale,
                    posStartY * renderScale,
                    numberWidth * renderScale,
                    numberWidth * renderScale
                )
                shiftX -= symbolGap[char]*2
                return
            }
            let number = Number(char)
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

function renderHealth(){
    if (gameManager.currentLevel.currentBattle){
        for (let i = 0; i < gameManager.player.hp;i++){
            ctx.drawImage(
                findSprite('icon_heart').img,
                (((borderLength/2) - ((gameManager.player.hp) * 4.5)) + (9 * i)) * renderScale,
                (135) * renderScale,
                8 * renderScale,
                8 * renderScale
            )
        } 
    } else {
        for (let i = 0; i < gameManager.player.hp;i++){
            ctx.drawImage(
                findSprite('icon_heart').img,
                (numberPadding) * renderScale,
                (numberPadding + (9 * i) + 12) * renderScale,
                8 * renderScale,
                8 * renderScale
            )
        } 
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
    const shiftX = ((numberPadding + 14) + 30)
    ctx.drawImage(
        findSprite(`icon_worm`).img,
        (shiftX) * renderScale,
        numberPadding * renderScale,
        8 * renderScale,
        8 * renderScale
    )
    let counter = gameManager.currentLevel.wormsLeft
    renderNumbers(counter, 0, (shiftX + 9) , numberPadding, -1, 'normal', 'red')
}

function renderBlockCount(){
    ctx.drawImage(
        findSprite(`icon_dirt`).img,
        (borderLength - numberPadding - 56) * renderScale,
        numberPadding * renderScale,
        8 * renderScale,
        8 * renderScale
    )
    let counter = gameManager.currentLevel.blockCount
    let negative = false;
    if (counter < 0){
        counter = Math.abs(counter)
        negative = true;
    }
    renderNumbers(counter, 0, numberPadding + 58, numberPadding, -1, 'reversed', 'brown')
}

function renderDepth(){
    ctx.drawImage(
        findSprite(`icon_door`).img,
        (borderLength - numberPadding - 8) * renderScale,
        numberPadding * renderScale,
        8 * renderScale,
        8 * renderScale
    )
    renderNumbers(gameManager.currentLevel.depth +1, 0, numberPadding + numberWidth + 2, numberPadding, -1, 'reversed', 'green')
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
    renderHealth()
    renderInventory()
    renderTimer()
    renderWormCounter()
    renderBlockCount()
    renderDepth()
    renderGoldCounter()
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