import { findSprite } from "../sprites.js";
import { Level } from "./level.js";
import { detonatorItem, flagItem, picaxeItem, cursorItem, woodSwordItem, woodShieldItem } from "./item.js";
import { Timer } from "./timer.js";
import { Player } from "./player.js";

export const borderLength = 168
export const borderThicness = 20

const starterInventory = [picaxeItem, woodSwordItem]

export class GameManager{
    constructor({}){
        this.currentLevel = new Level({}),
        this.selectedTool = picaxeItem,
        this.inventory = [...starterInventory],
        this.gold = 0,
        this.ended = false,
        this.timer = new Timer({length: 60000, whenEnd: ()=>{loseGame()}}),
        this.player = new Player({inventory: this.inventory})
    }
}

export let gameManager = new GameManager({})

export function restart(){
    gameManager = new GameManager({})
}

export function loseGame(){
    gameManager.ended = true
    gameManager.timer.stop()
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
        if (gameManager.currentLevel.inShop || gameManager.currentLevel.currentBattle || 
            this.posX < borderThicness || this.posX >= borderLength - borderThicness ||
            this.posY < borderThicness || this.posY >= borderLength - borderThicness){
            return findSprite('default_cursor').img
        }
        if (!gameManager.currentLevel.inShop && gameManager.selectedTool == picaxeItem && gameManager.currentLevel.started){
            if (gameManager.inventory.includes(detonatorItem) && 
                this.posX > borderThicness && this.posX <= borderLength - borderThicness &&
                this.posY > borderThicness && this.posY <= borderLength - borderThicness){
                let tileX = Math.floor((this.posX - borderThicness)/(gameManager.currentLevel.levelScale * 16))
                let tileY = Math.floor((this.posY - borderThicness)/(gameManager.currentLevel.levelScale * 16))
                if (gameManager.currentLevel.blocks[tileX][tileY].broken){
                    return findSprite(detonatorItem.name + '_cursor').img
                }
            }
        }
        return findSprite(gameManager.selectedTool.name + '_cursor').img
    }
}

export function swapTools(){
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