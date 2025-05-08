import { gameCursor, restart, swapTools } from "./game_manager.js"
import { borderLength, borderThicness, gameManager  } from "./game_manager.js"

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
    if (keyDict['Shift'] == KEYDOWN || keyDict['Shift'] == KEYUP){
        swapTools()
    }
    if (keyDict['Escape'] == KEYDOWN){
        gameManager.currentLevel.inShop = false
    }
}

export function clickHandler(posX, posY){
    if (posX > borderThicness && posX <= borderLength - borderThicness && posY > borderThicness && posY <= borderLength - borderThicness){
        posX = posX - borderThicness
        posY = posY - borderThicness
        if (gameManager.currentLevel.inShop){
            gameManager.currentLevel.shop.click(posX, posY)
            return
        }
        let tileX = Math.floor(posX/(gameManager.currentLevel.levelScale * 16))
        let tileY = Math.floor(posY/(gameManager.currentLevel.levelScale * 16))
        if (!gameManager.currentLevel.started){
            gameManager.currentLevel.start(tileX, tileY)
            return
        }
        if (gameManager.currentLevel.ended){
            restart()
        } else {
            gameManager.currentLevel.blocks[tileX][tileY].click(gameManager.selectedTool)
        }
    }
}

export function mouseMoveHandler(posX, posY){
    gameCursor.posX = posX
    gameCursor.posY = posY
}