import { LEFT } from "../user_input_handler.js"
import { gameCursor, pauseGame, pauseSwap, restart, swapTools } from "./game_manager.js"
import { borderLength, borderThicness, gameManager  } from "./game_manager.js"
import { flagItem } from "./item.js"

export const KEYUP = 'keyup'
export const KEYDOWN = 'keydown'
const KEYHELD = 'keyheld'
const keyDict = {}

export function keyHandler(key, state){
    if (state == KEYDOWN){
        if (keyDict[key] == KEYDOWN){
            keyDict[key] = KEYHELD
        } else {
            keyDict[key] = KEYDOWN
        }
    } else {
        keyDict[key] = KEYUP
    }
    if (keyDict[' '] == KEYDOWN){
        swapTools()
    }
    if (keyDict['Escape'] == KEYDOWN){
        pauseSwap()
    }
    if (keyDict['Shift'] == KEYDOWN || keyDict['Shift'] == KEYUP){
        swapTools()
    }
}

export function clickHandler(posX, posY, side){
    if (gameManager.paused){
        return
    }
    if (posX > borderThicness && posX < borderLength - borderThicness && posY > borderThicness && posY < borderLength - borderThicness){
        if (gameManager.ended){
            restart()
            return
        }
        posX = posX - borderThicness
        posY = posY - borderThicness
        if (gameManager.currentLevel.inShop){
            gameManager.currentLevel.shop.click(posX, posY)
            return
        }
        if (gameManager.currentLevel.currentBattle){
            gameManager.currentLevel.currentBattle.click(posX, posY)
            return
        }
        let tileX = Math.floor(posX/(gameManager.currentLevel.levelScale * 16))
        let tileY = Math.floor(posY/(gameManager.currentLevel.levelScale * 16))
        if (!gameManager.currentLevel.started){
            gameManager.timer.start()
            gameManager.currentLevel.start(tileX, tileY)
            return
        }
        if (side == LEFT){
            gameManager.currentLevel.blocks[tileX][tileY].click(gameManager.selectedTool)
        } else {
            gameManager.currentLevel.blocks[tileX][tileY].click(flagItem)
        }
    }
}

export function mouseMoveHandler(posX, posY){
    gameCursor.posX = posX
    gameCursor.posY = posY
}

export function unfocusHandler(){
    pauseGame()
}