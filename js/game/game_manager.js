import { ctx, renderScale } from "../canvas_handler.js";
import { findSprite } from "../sprites.js";
import { Level } from "../game/level_class.js";
import { CHECKER, FLAG, PICAXE } from "./shop.js";

export const borderLength = 160
export const borderThicness = 16

export const gameManager = {
    currentLevel: new Level({}),
    selectedTool: PICAXE,
    inventory: [],
    gold: 0,
}

export const gameCursor = {
    posX: 0,
    posY: 0,
    get sprite(){
        return findSprite(gameManager.selectedTool + '_cursor').img
    }
}

export function swapTools(){
    if (!gameManager.inventory.includes(FLAG)){
        return
    }
    if (gameManager.selectedTool == PICAXE){
        gameManager.selectedTool = FLAG
    } else {
        gameManager.selectedTool = PICAXE
    }
}

export function restart(){
    gameManager.currentLevel = new Level ({})
    gameManager.selectedTool = PICAXE
    gameManager.inventory = []
    gameManager.gold = 0
}