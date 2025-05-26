import { findSprite } from "../sprites.js";
import { Level, levelWithAShop } from "./level.js";
import { detonatorItem, flagItem, picaxeItem, cursorItem, woodSwordItem, woodShieldItem, chainmailArmorItem, silverBellItem } from "./item.js";
import { Timer } from "./timer.js";
import { Player } from "./player.js";

export const borderLength = 168
export const borderThicness = 20

const starterInventory = [picaxeItem, flagItem, woodSwordItem, woodShieldItem]

export class GameManager{
    constructor({}){
        if (GameManager.instance){
            return GameManager.instance
        }

        this.currentLevel = new Level({}),
        // this.currentLevel = levelWithAShop,
        this.selectedTool = picaxeItem,
        this.inventory = [...starterInventory],
        this.gold = 10,
        this.ended = false,
        this.timer = new Timer({length: 60000, whenEnd: ()=>{this.timerEnded = true; loseGame();}}),
        this.timerEnded = false;
        this.player = new Player({inventory: this.inventory})
        this.inTransition = false

        GameManager.instance = this
    }
    restart(){
        this.currentLevel = new Level({}),
        this.selectedTool = picaxeItem,
        this.inventory = [...starterInventory],
        this.gold = 0,
        this.ended = false,
        this.timer = new Timer({length: 60000, whenEnd: ()=>{this.timerEnded = true; loseGame();}}),
        this.timerEnded = false;
        this.player = new Player({inventory: this.inventory})
        this.inTransition = false
    }
}

export const gameManager = new GameManager({})

let gm_a = new GameManager({})
let gm_b = new GameManager({})

// console.log(gm_a === gameManager)
// console.log(gm_b === gm_a)

export function restart(){
    gameManager.restart()
}

export function pauseSwap(){
    if (gameManager.paused){
        unPauseGame()
    } else {
        pauseGame()
    }
}

export function pauseGame(){
    if (!gameManager.currentLevel.started){
        return
    }
    gameManager.paused = true
    gameManager.timer.pause()
    if (gameManager.currentLevel.currentBattle){
        gameManager.currentLevel.currentBattle.pause()
    }
}
export function unPauseGame(){
    gameManager.paused = false
    if (!gameManager.currentLevel.inShop){
        gameManager.timer.continue()
    }
    if (gameManager.currentLevel.currentBattle){
        gameManager.currentLevel.currentBattle.continue()
    }
}

export function loseGame(){
    gameManager.ended = true
    if (!gameManager.timerEnded){
        gameManager.timer.pause()
    }
    gameManager.currentLevel.blocks.forEach(column => {
        column.forEach(block =>{
            if (block.marker && block.content != 'worm'){
                block.marker = 'wrong'
            } else {
                block.broken = true
            }
        })
    })
}

export const gameCursor = {
    posX: borderLength,
    posY: borderLength,
    get sprite(){
        if (gameManager.ended || gameManager.ended || gameManager.currentLevel.inShop || 
            this.posX < borderThicness || this.posX >= borderLength - borderThicness ||
            this.posY < borderThicness || this.posY >= borderLength - borderThicness){
            return findSprite('cursor_default').img
        }
        if (gameManager.currentLevel.currentBattle){
            if (gameManager.player.actionTimer){
                return findSprite('cursor_hourglass').img
            } else if (this.posX < borderLength/2){
                return findSprite('cursor_sword').img
            } else {
                return findSprite('cursor_shield').img
            }
        }
        if (!gameManager.currentLevel.inShop && gameManager.selectedTool == picaxeItem && gameManager.currentLevel.started){
            if (this.posX > borderThicness && this.posX <= borderLength - borderThicness &&
                this.posY > borderThicness && this.posY <= borderLength - borderThicness){
                const tileX = Math.floor((this.posX - borderThicness)/(gameManager.currentLevel.levelScale * 16))
                const tileY = Math.floor((this.posY - borderThicness)/(gameManager.currentLevel.levelScale * 16))
                const block = gameManager.currentLevel.blocks[tileX][tileY]
                // if (block.content?.includes('door')){
                //     if (gameManager.inventory.includes(silverBellItem)){
                //         return findSprite('cursor_' + silverBellItem.name).img
                //     }
                // }
                if (block.broken && block.wormLevel > 0){
                    if (gameManager.inventory.includes(detonatorItem)){
                        return findSprite('cursor_' + detonatorItem.name).img
                    }
                }
            }
        }
        return findSprite('cursor_' + gameManager.selectedTool.name).img
    }
}

export function swapTools(){
    if (gameManager.paused){
        return
    }
    if (gameManager.selectedTool == picaxeItem){
        if (!gameManager.inventory.includes(flagItem)){
            gameManager.selectedTool = cursorItem
        } else {
            gameManager.selectedTool = flagItem
        }
    } else {
        gameManager.selectedTool = picaxeItem
    }
}