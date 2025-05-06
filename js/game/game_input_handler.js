import { borderLength, borderThicness, FLAG, gameManager, PICAXE } from "/js/game/game_manager.js"

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
        if (gameManager.selectedTool == PICAXE){
            gameManager.selectedTool = FLAG
        } else {
            gameManager.selectedTool = PICAXE
        }
    }
    if (keyDict['Shift'] == KEYDOWN || keyDict['Shift'] == KEYUP){
        if (gameManager.selectedTool == PICAXE){
            gameManager.selectedTool = FLAG
        } else {
            gameManager.selectedTool = PICAXE
        }
    }
}

export function clickHandler(posX, posY){
    if (posX > borderThicness && posX <= borderLength - borderThicness && posY > borderThicness && posY <= borderLength - borderThicness){
        let tileX = Math.floor((posX-borderThicness)/(gameManager.currentLevel.levelScale * 16))
        let tileY = Math.floor((posY-borderThicness)/(gameManager.currentLevel.levelScale * 16))
        if (gameManager.selectedTool == PICAXE){
            if (!gameManager.currentLevel.started){
                gameManager.currentLevel.start(tileX, tileY)
            } else {
                gameManager.currentLevel.blocks[tileX][tileY].break()
                gameManager.currentLevel.checkWin()
            }
        } else {
            if (gameManager.currentLevel.started){
                gameManager.currentLevel.blocks[tileX][tileY].mark()
            }
        }
    }
}

export function wheelHandler(degrees){
    if (gameManager.selectedTool == PICAXE){
        gameManager.selectedTool = FLAG
    } else {
        gameManager.selectedTool = PICAXE
    }
}