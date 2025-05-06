import { ctx, renderScale } from "../canvas_handler.js";
import { difficultyInput, sizeInput } from "../html_handler.js";
import { findSprite } from "../sprites.js";
import { Level } from "./level_class.js";

export const PICAXE = 'picaxe';
export const FLAG = 'flag';
export const borderLength = 160
export const borderThicness = 16

export const gameManager = {
    currentLevel: new Level({}),
    selectedTool: PICAXE
}

function renderBorder(){
    ctx.drawImage(
        findSprite('game_border').img,
        0,0,
        160 * renderScale,
        160 * renderScale
    )
}

export function newGame(){
    gameManager.currentLevel = new Level ({
        size: sizeInput.value,
        difficulty: difficultyInput.value
    })
    gameManager.selectedTool = PICAXE
}

const tools = [PICAXE, FLAG]
function renderTools(){
    tools.forEach((tool, index) =>{
        let toolName = tool
        if (gameManager.selectedTool == tool){
            toolName += '_selected'
        }
        ctx.drawImage(
            findSprite(`${toolName}`).img,
            borderThicness * (index+1) * renderScale,
            (borderLength - borderThicness) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
    })
}

function renderTimer(){
    let miliseconds = gameManager.currentLevel.timer.miliseconds
    if (miliseconds <= 0){
        miliseconds = 0
    }
    let string = miliseconds.toString()
    let vector = [...string]
    vector.pop()
    vector.pop()
    vector.pop()
    vector.forEach((number, index)=>{
        ctx.drawImage(
            findSprite(`numbers_purple`).img,
            16 * number,
            0,
            16,
            16,
            16 * index * renderScale,
            0,
            16 * renderScale,
            16 * renderScale
        )
    })
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
    for(let i = vector.length - 1; i >= 0; i--){
        const number = vector[i]
        ctx.drawImage(
            findSprite(`numbers_red`).img,
            16 * number,
            0,
            16,
            16,
            (borderLength - (16 * (vector.length - i)))* renderScale,
            0,
            16 * renderScale,
            16 * renderScale
        )
    }
    if (negative){
        ctx.drawImage(
            findSprite(`minus_red`).img,
            (borderLength - (16 * (vector.length + 1)))* renderScale,
            0,
            16 * renderScale,
            16 * renderScale
        )
    }
}

function renderUI(){
    renderTools()
    renderTimer()
    renderFlagCounter()
}

function renderCursor(){
    document.querySelector('canvas').style.cursor = `url("/images/${gameManager.selectedTool}_cursor.png"), auto;`
}

export function renderGame(){
    renderBorder()
    renderUI()
    renderCursor()
    gameManager.currentLevel.renderBlocks()
}