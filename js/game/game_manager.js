import { ctx, renderScale } from "../canvas_handler.js";
import { findSprite } from "../sprites.js";
import { Level } from "../game/level_class.js";
import { CHECKER, CURSOR, FLAG, PICAXE } from "./shop.js";

export const borderLength = 168
export const borderThicness = 20

const starterInventory = [PICAXE]

export const gameManager = {
    currentLevel: new Level({}),
    selectedTool: PICAXE,
    inventory: [...starterInventory],
    gold: 0,
}

export const gameCursor = {
    posX: 0,
    posY: 0,
    get sprite(){
        if (gameManager.currentLevel.inShop || 
            this.posX < borderThicness || this.posX >= borderLength - borderThicness ||
            this.posY < borderThicness || this.posY >= borderLength - borderThicness){
            return findSprite('default_cursor').img
        }
        if (!gameManager.currentLevel.inShop && gameManager.selectedTool == PICAXE && gameManager.currentLevel.started){
            if (gameManager.inventory.includes(CHECKER) && 
                this.posX > borderThicness && this.posX <= borderLength - borderThicness &&
                this.posY > borderThicness && this.posY <= borderLength - borderThicness){
                let tileX = Math.floor((this.posX - borderThicness)/(gameManager.currentLevel.levelScale * 16))
                let tileY = Math.floor((this.posY - borderThicness)/(gameManager.currentLevel.levelScale * 16))
                if (gameManager.currentLevel.blocks[tileX][tileY].broken){
                    return findSprite(CHECKER + '_cursor').img
                }
            }
        }
        return findSprite(gameManager.selectedTool + '_cursor').img
    }
}

export function swapTools(){
    if (gameManager.selectedTool == PICAXE){
        if (!gameManager.inventory.includes(FLAG)){
            gameManager.selectedTool = CURSOR
        } else {
            gameManager.selectedTool = FLAG
        }
    } else {
        gameManager.selectedTool = PICAXE
    }
}

export function restart(){
    gameManager.currentLevel = new Level ({})
    gameManager.selectedTool = PICAXE
    gameManager.inventory = [...starterInventory]
    gameManager.gold = 0
}